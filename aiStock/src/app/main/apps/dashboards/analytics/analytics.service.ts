import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { predictionGroup, getProductDetails, getPortfolio } from 'appConfig/appconfig';
import { tap } from 'rxjs/operators';
import { BehaviorSubject, Observable, from } from 'rxjs';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    column: any[];
    widgets: any[];
    product: any[];
    portfolio: any[] = [];
    realTimeData: any[] = [];
    predictionGroupData: any[];
    groupName: string;
    groupId: string;
    errmsg: string;
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
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
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
        return new Promise((resolve, reject) => {
            this._httpClient.get(getPortfolio, this.httpOptions)
                .subscribe((response: any) => {

                    this.column = response.data;
                    console.log(this.column)
                    for (var i = 0; i < this.column.length; i++) {
                        //this.portfolio.push(this.column[i]['real_time_price']);
                        this.realTimeData.push(this.column[i]['real_time_price']);
                        for (var j = 0; j < this.realTimeData[i].stock.length; j++) {
                            // console.log("data:::::::::" + this.realTimeData[j]);
                            this.portfolio.push(this.realTimeData[j]);

                        }
                    }
                    this.onPortfolioChanged.next(this.portfolio);
                    resolve(response);
                }, err => {
                    resolve([])
                    this.errmsg = err.error.message;

                });
        });
    }
    public getGroupList(): Observable<any> {
        return this._httpClient.get(predictionGroup, this.httpOptions);
    }

    public getProduct(): Observable<any> {
        return this._httpClient.get(getProductDetails, this.httpOptions);
    }

}
