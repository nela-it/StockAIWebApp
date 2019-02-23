import { group } from '@angular/animations';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { merge, Observable, BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';

import { takeUntil } from 'rxjs/internal/operators';
import { PredictionListService } from './prediction.service';
import { ActivatedRoute } from '@angular/router';

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
        private _predictionListService: PredictionListService,
        private route: ActivatedRoute
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
        });
        // console.log(this._predictionListService, this.paginator, this.sort);
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
    }

    activeStock(tab) {
        this.activeStockTab = tab;
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
                    [propertyA, propertyB] = [a.stockName, b.stockName];
                    break;
                case 'recommendedPrice':
                    [propertyA, propertyB] = [a.recommendedPrice, b.recommendedPrice];
                    break;
                case 'currentPrice':
                    [propertyA, propertyB] = [a.currentPrice, b.currentPrice];
                    break;
                case 'suggestedDate':
                    [propertyA, propertyB] = [a.suggestedDate, b.suggestedDate];
                    break;
                case 'tragetPrice':
                    [propertyA, propertyB] = [a.tragetPrice, b.tragetPrice];
                    break;
                case 'date':
                    [propertyA, propertyB] = [a.date, b.date];
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
