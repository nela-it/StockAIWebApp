import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject, from } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/internal/operators';
import { PredictionListService } from './prediction.service';
import { ActivatedRoute } from '@angular/router';
import { AnalyticsDashboardService } from '../analytics.service';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material';

export interface Food {
    value: string;
    viewValue: string;
}
@Component({
    selector: 'prediction-list',
    templateUrl: './prediction.component.html',
    styleUrls: ['./prediction.component.scss'],
    animations: fuseAnimations
})
export class PredictionListComponent implements OnInit, OnDestroy {
    pageSize;
    groupId;
    activeStockTab = 'listStocks';
    dataSource: FilesDataSource | null;
    displayedColumns = ['ticker', 'stockName', 'recommendedPrice', 'currentPrice', 'suggestedDate', 'tragetPrice', 'action'];
    stockName: string;
    activeFilterTab = 'all';
    paginateTab = "next";
    foods: Food[] = [
        { value: 'steak-0', viewValue: 'Steak' },
        { value: 'pizza-1', viewValue: 'Pizza' },
        { value: 'tacos-2', viewValue: 'Tacos' }
    ];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild('filter')
    filter: ElementRef;

    @ViewChild(MatSort)
    sort: MatSort;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {PredictionListService} _predictionListService
     */
    constructor(
        public _predictionListService: PredictionListService,
        private route: ActivatedRoute,
        public _analyticsDashboardService: AnalyticsDashboardService,
        private router: Router,
        public snackBar: MatSnackBar,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.groupId = params['id'];
            this.stockName = params['stockname'];
        });
        this.getPortfolioData();

    }
    getPortfolioData() {
        // alert('hiii');
        this.dataSource = new FilesDataSource(this._predictionListService, this.paginator, this.sort);
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
        this.changeDetectorRefs.detectChanges();
    }
    activeStock(tab) {
        this.activeStockTab = tab;
    }
    openStockDetail(stockid) {
        this.router.navigate(['/apps/dashboards/analytics/stockDetail', btoa(stockid), this.groupId, this.stockName]);
    }
    addToPortfolioSubmit(stockId: string) {
        if (stockId) {
            const stockid = {
                'stockId': stockId.toString()
            }
            this._predictionListService.addToPortfolio(stockid).subscribe((result) => {

                this.snackBar.open('Success', 'Your porfolio successfully added.', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
                this._predictionListService.toGetPredictions(this.groupId).subscribe((result) => {
                    this._predictionListService.predictions = result.data;
                    this.dataSource = new FilesDataSource(this._predictionListService, this.paginator, this.sort);
                    // window.location.reload();
                }, (err) => {
                    console.log(err);
                });
                // this.getPortfolioData()
                // window.location.reload();
            }, (err) => {
                console.log(err);
                if (err) {
                    this.snackBar.open('Error', err.error.message, {
                        duration: 2000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                }
            });
        }
    }
    active_filter(tab) {
        this.activeFilterTab = tab;
    }
    paginate(tab) {
        this.paginateTab = tab;
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
     * @param {PredictionListService} _predictionListService
     * @param {MatPaginator} _matPaginator
     * @param {MatSort} _matSort
     */
    constructor(
        private _predictionListService: PredictionListService,
        private _matPaginator: MatPaginator,
        private _matSort: MatSort,
    ) {
        super();

        this.filteredData = this._predictionListService.predictions;
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
            this._predictionListService.onPredictionsChanged,
            this._matPaginator.page,
            this._filterChange,
            this._matSort.sortChange
        ];

        return merge(...displayDataChanges).pipe(map(() => {

            let data = this._predictionListService.predictions.slice();

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
