import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { predictionGroup, getProductDetails, getPortfolio, getSub, getChartDataDetails } from 'appConfig/appconfig';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from } from 'rxjs';
import _ from 'underscore';
@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    column: any[];
    widgets: any[];
    product: any[];
    portfolio: any[] = [];
    groupsList: any[] = [];
    allGroupData: any[] = [];
    tickerArray: any[] = [];
    realTimeData: any[] = [];
    noOfTickers: any;
    predictionGroupData: any[];
    groupName: string;
    groupId: string;
    errmsg: string;
    fontColor: string;
    onPortfolioChanged: BehaviorSubject<any>;
    httpOptions
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */

    constructor(
        private _httpClient: HttpClient
    ) {
        //localStorage.getItem('LoggedInUser')

        this.onPortfolioChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getWidgets(),
                this.getPortfolio()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get widgets
     *
     * @returns {Promise<any>}
     */
    getWidgets(): Promise<any> {

        return new Promise((resolve, reject) => {
            this._httpClient.get('api/analytics-dashboard-widgets')
                .subscribe((response: any) => {
                    this.widgets = response;
                    resolve(response);
                }, reject);
        });
    }
    getPortfolio(): Promise<any> {
        // http://192.168.0.9:3001/api/portfolio/getPortfolio
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
        return new Promise((resolve, reject) => {
            this._httpClient.get(getPortfolio, this.httpOptions)
                .subscribe((response: any) => {
                    this.column = response.data;
                    console.log(this.column);
                    this.realTimeData = [];
                    for (let i = 0; i < this.column.length; i++) {
                        this.column[i]['real_time_price']['real_time_price_value'] = this.column[i].real_time_price_value;
                        this.column[i]['real_time_price']['realId'] = this.column[i].real_time_price.id;

                        this.realTimeData.push(this.column[i]['real_time_price']);

                        if (i + 1 === this.column.length) {
                            this.portfolio = [];
                            for (let j = 0; j < this.realTimeData.length; j++) {
                                this.portfolio.push(this.realTimeData[j].stock);
                                this.portfolio[j].real_time_price_value = this.realTimeData[j].real_time_price_value;
                                this.portfolio[j].realId = this.realTimeData[j].realId;
                                this.portfolio[j].current_price = this.realTimeData[j].current_price;
                                this.portfolio[j].realCreateDate = this.realTimeData[j].updatedAt;

                                this.portfolio[j].today_change_percentage = this.realTimeData[j].today_change_percentage;
                                this.portfolio[j].todayperfontColor = parseFloat(this.portfolio[j].today_change_percentage) >= 0 ? 'green' : 'red';

                                this.portfolio[j].today_change = this.realTimeData[j].today_change;
                                this.portfolio[j].todayaddfontColor = parseFloat(this.portfolio[j].today_change) >= 0 ? 'green' : 'red';

                                this.portfolio[j].your_change_percentage = this.realTimeData[j].your_change_percentage;
                                this.portfolio[j].yourperfontColor = parseFloat(this.portfolio[j].your_change_percentage) >= 0 ? 'green' : 'red';

                                this.portfolio[j].your_change = this.realTimeData[j].your_change;
                                this.portfolio[j].addyourfontColor = parseFloat(this.portfolio[j].your_change) >= 0 ? 'green' : 'red';
                            }
                        }
                    }
                    for (let a = 0; a < this.portfolio.length; a++) {
                        this.portfolio[a].groupName = this.portfolio[a].Prediction_group['group_name'];
                        this.groupsList.push({ 'name': this.portfolio[a].Prediction_group['group_name'], 'group_id': this.portfolio[a].group_id });
                        this.tickerArray.push(this.portfolio[a].ticker)
                    }
                    this.noOfTickers = _.uniq(this.tickerArray).length;
                    this.allGroupData = _.uniq(this.groupsList, (x) => {
                        return x.name;
                    });

                    this.onPortfolioChanged.next(this.portfolio);
                    resolve(response);
                }, err => {
                    resolve([]);
                    this.errmsg = err.error.message;
                });
        });
    }
    public getGroupList(): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };

        return this._httpClient.get(predictionGroup, this.httpOptions);
    }

    public getProduct(): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
        return this._httpClient.get(getProductDetails, this.httpOptions);
    }

    public getChartData(group, days): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
        return this._httpClient.post(getChartDataDetails, { 'group': group, 'days': days }, this.httpOptions);
    }

    public getSubPlan(): Observable<any> {

        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
        return this._httpClient.get(getSub, this.httpOptions);
    }
}
