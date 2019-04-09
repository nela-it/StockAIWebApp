import { Component, ElementRef, OnInit, ViewEncapsulation, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { MatPaginator, MatSort, MatSelect } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { DataSource } from '@angular/cdk/collections';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { Router } from '@angular/router';
import { PredictionListService } from './prediction/prediction.service';
import { merge, Observable, BehaviorSubject, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { FuseUtils } from '@fuse/utils';
import * as moment from 'moment';


@Component({
    selector: 'analytics-dashboard',
    templateUrl: './analytics.component.html',
    styleUrls: ['./analytics.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class AnalyticsDashboardComponent implements OnInit, OnDestroy {
    widgets: any;
    product: any;
    widget1SelectedYear = '2016';
    widget5SelectedDay = 'today';
    activeStock = 'prediction';
    selectedStock = '';
    selectedGroups = 'all';
    selecteddays = 'Daily';
    predictionGroupData: any;
    isSubscribed: any;
    errMsg;
    message: string;
    pageSize;
    groupId;
    dataSource: FilesDataSource | null;
    chartType;
    chartDatasets;
    chartLabels;
    chartColors;
    chartOptions;
    portfolioPrice = [];
    realTimePrice = [];
    portfolioLabels = [];
    displayedColumns = ['ticker', 'groupName', 'stockName', 'recommendedPrice',
        'currentPrice', 'suggestedDate', 'tragetPrice', 'todayChangePercentage', 'addTodayChange', 'yourChangePercentage', 'addYourChange'];
    stockName: string;
    portfolio: boolean;

    @ViewChild(MatPaginator)
    public paginator: MatPaginator;

    @ViewChild('filter')
    filter: ElementRef;

    @ViewChild('selectGroups') selectGroups: MatSelect;
    @ViewChild('selectdays') selectdays: MatSelect;


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
        private router: Router,
        private changeDetectorRefs: ChangeDetectorRef
    ) {
        // Register the custom chart.js plugin
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Predictions group data
        this._analyticsDashboardService.getGroupList().subscribe(res => {
            this.isSubscribed = res.isSubscribed;
            this.predictionGroupData = res.data;
        }, error => {
            this.errMsg = error.message;
        });

        // Product group data
        this._analyticsDashboardService.getProduct().subscribe(res => {
            this.product = res.data;
        }, error => {
            this.errMsg = error.message;
        });
        this.dataSource = new FilesDataSource(this._analyticsDashboardService, this.paginator, this.sort);
        this.loadChart('all', 'Daily');
    }

    loadChart(group, days): void {
        this.portfolioPrice = [];
        this.realTimePrice = [];
        this.portfolioLabels = [];
        const d = {
            'source': 'Google Trends',
            'keywords':
                [
                    {
                        'value': 'Keyword 1',
                        'data':
                            [
                                {
                                    'month': 'Dec',
                                    'popularity': '10'
                                },
                                {
                                    'month': 'Jan',
                                    'popularity': '35'
                                }
                            ]
                    },
                ]
        };
        this._analyticsDashboardService.getChartData(group, days).subscribe(res => {
            console.log(res);
            for (let i = 0; i < res.data.length; i++) {
                this.portfolioPrice.push(res.data[i].portfolio);
                this.realTimePrice.push(res.data[i].realTime);
                this.portfolioLabels.push(`${res.data[i].time} | ${res.data[i].stockName}`);
                console.log(res.data.length, i + 1);
                if (res.data.length === i + 1) {
                    // line horizontalBar
                    this.chartType = 'line';
                    this.chartDatasets = [
                        {
                            label: 'User Portfolio price',
                            data: this.portfolioPrice,
                            fill: false

                        },
                        {
                            label: 'Real time Price',
                            data: this.realTimePrice,
                            fill: false
                        }
                    ];
                    // [
                    //     {
                    //         label: 'User Portfolio price',
                    //         data: this.portfolioPrice,
                    //         fill: false

                    //     },
                    //     {
                    //         label: 'Real time Price',
                    //         data: this.realTimePrice,
                    //         fill: false
                    //     }
                    // ]
                    // [{
                    //     data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                    //     label: 'Africa',
                    //     borderColor: '#3e95cd',
                    //     fill: false
                    // }, {
                    //     data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                    //     label: 'Asia',
                    //     borderColor: '#8e5ea2',
                    //     fill: false
                    // }, {
                    //     data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                    //     label: 'Europe',
                    //     borderColor: '#3cba9f',
                    //     fill: false
                    // }, {
                    //     data: [40, 20, 10, 16, 24, 38, 74, 167, 508, 784],
                    //     label: 'Latin America',
                    //     borderColor: '#e8c3b9',
                    //     fill: false
                    // }, {
                    //     data: [6, 3, 2, 2, 7, 26, 82, 172, 312, 433],
                    //     label: 'North America',
                    //     borderColor: '#c45850',
                    //     fill: false
                    // }]
                    this.chartLabels = this.portfolioLabels;
                    this.chartColors = [
                        {
                            borderColor: '#3949ab',
                            backgroundColor: '#3949ab',
                            pointBackgroundColor: '#3949ab',
                            pointHoverBackgroundColor: '#3949ab',
                            pointBorderColor: '#ffffff',
                            pointHoverBorderColor: '#ffffff'
                        },
                        {
                            borderColor: 'rgba(30, 136, 229, 0.87)',
                            backgroundColor: 'rgba(30, 136, 229, 0.87)',
                            pointBackgroundColor: 'rgba(30, 136, 229, 0.87)',
                            pointHoverBackgroundColor: 'rgba(30, 136, 229, 0.87)',
                            pointBorderColor: '#ffffff',
                            pointHoverBorderColor: '#ffffff'
                        }
                    ];
                    this.chartOptions = {
                        spanGaps: false,
                        responsive: true,
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false,
                        tooltips: {
                            position: 'nearest',
                            mode: 'index',
                            intersect: false
                        },
                        layout: {
                            padding: {
                                left: 24,
                                right: 32
                            }
                        },
                        elements: {
                            point: {
                                radius: 4,
                                borderWidth: 2,
                                hoverRadius: 4,
                                hoverBorderWidth: 2
                            }
                        },
                        scales: {
                            xAxes: [
                                {
                                    gridLines: {
                                        display: false
                                    },
                                    ticks: {
                                        fontColor: 'rgba(0,0,0,0.54)',
                                        autoSkip: false,
                                    }

                                }
                            ],
                            yAxes: [
                                {
                                    gridLines: {
                                        tickMarkLength: 1
                                    },
                                    ticks: {
                                        beginAtZero: true,
                                        min: 0
                                    }
                                }
                            ]
                        },
                        plugins: {
                            filler: {
                                propagate: false
                            }
                        }
                    };
                }
            }
        }, error => {
            this.errMsg = error.message;
        });
        // portfolioData.map((item, i) => {
        //     // console.log(item);
        //     if (days === 'Daily' && group === 'all') {
        //         if (moment().isSame(item.realCreateDate, 'day')) {
        //             this.portfolioPrice.push(item.real_time_price_value);
        //             this.realTimePrice.push(item.current_price);
        //             this.portfolioLabels.push(`${moment(item.realCreateDate).format('hh:mm A')} | ${item.stock_name}`)
        //         }
        //     } else if (days === 'Weekly') {
        //         console.log(moment(item.realCreateDate).isBetween(moment().startOf('week'), moment().endOf('week')));
        //         console.log(moment().startOf('week'), moment().endOf('week'));
        //         // if (moment().startOf('week') >= moment(item.real_time_price_update_date) && moment().endOf('week') >= moment(item.real_time_price_update_date)) {
        //         //     console.log();
        //         // }
        //     }
        // });


    }

    selectedDayGroup(e): void {
        console.log(this.selectGroups);
        if (this.selectGroups.value === undefined) {
            this.loadChart(this.selectGroups.triggerValue, this.selectdays.triggerValue);
        } else if (this.selectGroups.value === 'all') {
            this.loadChart(this.selectGroups.value, this.selectdays.triggerValue);
        } else {
            this.loadChart(this.selectGroups.value.group_id, this.selectdays.triggerValue);
        }
    }

    selectedDay(e): void {
        if (e.value === 'Daily') {
            console.log(moment());
        } else if (e.value === 'Weekly') {
            console.log(moment().startOf('week'), moment().endOf('week'));
        } else {
            console.log(moment().month());
        }
    }


    active_stock(tab): void {
        this.activeStock = tab;
        if (this.activeStock === 'portfolio') {
            this.portfolio = true;
        }
    }

    groupDetail(data): void {
        // console.log("explore button call", data);
        this._predictionListService.groupId = btoa(data.id);
        this._analyticsDashboardService.groupName = data.group_name;
        this._predictionListService.groupName = data.group_name;
        this.router.navigate(['/apps/dashboards/analytics/prediction', btoa(data.id), data.group_name]);
    }
    selected(event): void {
        // console.log(event);
        this.dataSource.filter = event.value.name;
        this.changeDetectorRefs.detectChanges();

    }
    subscription(): void {
        // window.location.href = 'https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-5D480456AA4645139';
        this._analyticsDashboardService.getSubPlan().subscribe(res => {
            if (res.redirection_link) {
                window.location.href = res.redirection_link;
                // window.open('https://www.google.com', "_blank");
            }
        }, error => {
            this.errMsg = error.message;
        });

    }

    openStockDetail(stockid, realId, groupid, stockname, flag): void {
        this.router.navigate(['/apps/dashboards/analytics/stockDetail', btoa(stockid), btoa(realId), btoa(groupid), stockname, flag]);
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
                    [propertyA, propertyB] = [a.current_price, b.current_price];
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
                case 'todaychangeper':
                    [propertyA, propertyB] = [a.today_change_percentage, b.today_change_percentage];
                    break;
                case 'addtodaychange':
                    [propertyA, propertyB] = [a.today_change, b.today_change];
                    break;
                case 'yourchangeper':
                    [propertyA, propertyB] = [a.your_change_percentage, b.your_change_percentage];
                    break;
                case 'addyourchange':
                    [propertyA, propertyB] = [a.your_change, b.your_change];
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

