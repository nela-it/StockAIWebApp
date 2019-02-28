import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { predictionGroup, getProductDetails } from 'appConfig/appconfig';
import { tap } from 'rxjs/operators';

@Injectable()
export class AnalyticsDashboardService implements Resolve<any>
{
    widgets: any[];
    product: any[];
    predictionGroupData: any[];
    groupName: string;
    groupId: string;
    httpOptions
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */

    constructor(
        private _httpClient: HttpClient
    ) {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
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
                this.getWidgets()
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

    public getGroupList(): Observable<any> {
        return this._httpClient.get(predictionGroup, this.httpOptions);
    }

    public getProduct(): Observable<any> {
        return this._httpClient.get(getProductDetails, this.httpOptions);
    }

}
