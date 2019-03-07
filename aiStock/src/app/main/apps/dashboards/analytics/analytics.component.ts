import { Component, ElementRef, OnInit, ViewEncapsulation, ViewChild, OnDestroy, AfterViewInit } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { DataSource } from '@angular/cdk/collections';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { Router } from '@angular/router';
import { PredictionListService } from './prediction/prediction.service';
import { merge, Observable, BehaviorSubject, fromEvent, Subject, from } from 'rxjs';
import { takeUntil } from 'rxjs/internal/operators';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';


@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy, AfterViewInit {
    widgets: any;
    product: any;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    activeStock = 'prediction';
    predictionGroupData: any;
    errMsg;
    message: string;
    pageSize;
    groupId;
    dataSource: FilesDataSource | null;
    displayedColumns = ['ticker', 'stockName', 'recommendedPrice', 'currentPrice', 'suggestedDate', 'tragetPrice', 'action'];
    stockName: string;
    portfolio: boolean;
    @ViewChild(MatPaginator)
    public paginator: MatPaginator;

    @ViewChild('filter')
    filter: ElementRef;

    @ViewChild(MatSort)
    public sort: MatSort;

    // Private
    private _unsubscribeAll: Subject<any>;
    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService
     */
    constructor(
        public _analyticsDashboardService: AnalyticsDashboardService,
        public _predictionListService: PredictionListService,
        private router: Router
    ) {
        // Register the custom chart.js plugin
        this._registerCustomChartJSPlugin();
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Get the widgets from the service
        this.widgets = this._analyticsDashboardService.widgets;
        // Predictions group data
        this._analyticsDashboardService.getGroupList().subscribe(res => {
            this.predictionGroupData = res.data;
        }, error => {
            console.log(error);
            this.errMsg = error.message;
        });

        // Product group data
        this._analyticsDashboardService.getProduct().subscribe(res => {
            this.product = res.data;
        }, error => {
            console.log(error);
            this.errMsg = error.message;
        });
        this.dataSource = new FilesDataSource(this._analyticsDashboardService, this.paginator, this.sort);

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(150),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    ngAfterViewInit() {
        /* console.log(this.sort); // MatSort{}
        console.log(this.paginator) */
        console.log(this.dataSource)
        /*  this.dataSource.paginator = this.paginator;
         this.dataSource.sort = this.paginator; */

    }
    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Register a custom plugin
     */
    private _registerCustomChartJSPlugin(): void {
        (<any>window).Chart.plugins.register({
            afterDatasetsDraw: function (chart, easing) {
                // Only activate the plugin if it's made available
                // in the options
                if (
                    !chart.options.plugins.xLabelsOnTop ||
                    (chart.options.plugins.xLabelsOnTop && chart.options.plugins.xLabelsOnTop.active === false)
                ) {
                    return;
                }

                // To only draw at the end of animation, check for easing === 1
                const ctx = chart.ctx;

                chart.data.datasets.forEach(function (dataset, i) {
                    const meta = chart.getDatasetMeta(i);
                    if (!meta.hidden) {
                        meta.data.forEach(function (element, index) {

                            // Draw the text in black, with the specified font
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
                            const fontSize = 13;
                            const fontStyle = 'normal';
                            const fontFamily = 'Roboto, Helvetica Neue, Arial';
                            ctx.font = (<any>window).Chart.helpers.fontString(fontSize, fontStyle, fontFamily);

                            // Just naively convert to string for now
                            const dataString = dataset.data[index].toString() + 'k';

                            // Make sure alignment settings are correct
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            const padding = 15;
                            const startY = 24;
                            const position = element.tooltipPosition();
                            ctx.fillText(dataString, position.x, startY);

                            ctx.save();

                            ctx.beginPath();
                            ctx.setLineDash([5, 3]);
                            ctx.moveTo(position.x, startY + padding);
                            ctx.lineTo(position.x, position.y - padding);
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)';
                            ctx.stroke();

                            ctx.restore();
                        });
                    }
                });
            }
        });
    }

    active_stock(tab) {
        this.activeStock = tab;
        if (this.activeStock === 'portfolio') {
            this.portfolio = true;
        }
    }

    groupDetail(data) {

        this._predictionListService.groupId = btoa(data.id);
        this._analyticsDashboardService.groupName = data.group_name;
        this._predictionListService.groupName = data.group_name;
        this.router.navigate(['/apps/dashboards/analytics/prediction', btoa(data.id), data.group_name]);
    }
    /**
 * On destroy
 */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

export class FilesDataSource extends DataSource<any>
{
    // Private
    private _filterChange = new BehaviorSubject('');
    private _filteredDataChange = new BehaviorSubject('');
    /**
     * Constructor
     *
     * @param {AnalyticsDashboardService} _analyticsDashboardService    
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _analyticsDashboardService: AnalyticsDashboardService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
    ) {
        super();

        this.filteredData = this._analyticsDashboardService.portfolio;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // Filtered data
    get filteredData(): any {
        return this._filteredDataChange.value;
    }

    set filteredData(value: any) {
        this._filteredDataChange.next(value);
    }

    // Filter
    get filter(): string {
        return this._filterChange.value;
    }

    set filter(filter: string) {
        this._filterChange.next(filter);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     *
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]> {
        const displayDataChanges = [
            this._analyticsDashboardService.onPortfolioChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

            let data = this._analyticsDashboardService.portfolio.slice();

            data = this.filterData(data);

            this.filteredData = [...data];

            data = this.sortData(data);

            // Grab the page's slice of data.
            const startIndex = this._matPaginator.pageIndex * this._matPaginator.pageSize;
            return data.splice(startIndex, this._matPaginator.pageSize);
        })
        );

    }

    /**
     * Filter data
     *
     * @param data
     * @returns {any}
     */
    filterData(data): any {
        if (!this.filter) {
            return data;
        }
        return FuseUtils.filterArrayByString(data, this.filter);
    }

    /**
     * Sort data
     *
     * @param data
     * @returns {any[]}
     */
    sortData(data): any[] {

        if (!this._matSort.active || this._matSort.direction === '') {
            return data;
        }

        return data.sort((a, b) => {
            let propertyA: number | string = '';
            let propertyB: number | string = '';

            switch (this._matSort.active) {
                case 'ticker':
                    [propertyA, propertyB] = [a.ticker, b.ticker];
                    break;
                case 'stockName':
                    [propertyA, propertyB] = [a.stock_name, b.stock_name];
                    break;
                case 'recommendedPrice':
                    [propertyA, propertyB] = [a.recommended_price, b.recommended_price];
                    break;
                case 'currentPrice':
                    [propertyA, propertyB] = [a.suggested_date_price, b.suggested_date_price];
                    break;
                case 'suggestedDate':
                    [propertyA, propertyB] = [a.suggested_date, b.suggested_date];
                    break;
                case 'tragetPrice':
                    [propertyA, propertyB] = [a.target_price, b.target_price];
                    break;
                case 'date':
                    [propertyA, propertyB] = [a.target_date, b.target_date];
                    break;
            }

            const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
            const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

            return (valueA < valueB ? -1 : 1) * (this._matSort.direction === 'asc' ? 1 : -1);
        });
    }

    /**
     * Disconnect
     */
    disconnect(): void {
    }
}

