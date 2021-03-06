import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { getGroupsDetails, addPortfolio } from 'appConfig/appconfig';
import { map, catchError, tap } from 'rxjs/operators';

@Injectable()
export class PredictionListService implements Resolve<any>
{
    predictions: any[];
    realTimeData: any[] = [];
    id: string;
    groupId: string;
    groupName: string;
    addedFlag = false;
    isSubscribed: string;
    onPredictionsChanged: BehaviorSubject<any>;
    httpOptions;
    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */

    constructor(
        private _httpClient: HttpClient,
    ) {

        // Set the defaults
        this.onPredictionsChanged = new BehaviorSubject({});
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
                this.getPredictions(route.params.id)
                //this.addToPortfolio()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get Predictions
     *
     * @returns {Promise<any>}
     */

    getPredictions(id): Promise<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
        return new Promise((resolve, reject) => {
            this._httpClient.post(getGroupsDetails, { 'group_id': id }, this.httpOptions)
                .subscribe((response: any) => {
                    this.isSubscribed = response.isSubscribed;
                    this.predictions = [];
                    this.predictions = response.data;
                    for (let i = 0; i < this.predictions.length; i++) {
                        this.realTimeData.push(this.predictions[i]['real_time_price']);
                        for (let a = 0; a < this.realTimeData.length; a++) {
                            this.predictions[i].current_price = this.realTimeData[a].current_price;
                        }
                    }
                    this.onPredictionsChanged.next(this.predictions);
                    resolve(response);
                }, reject);
        });
    }


    addToPortfolio(stockId): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
        return this._httpClient.post(addPortfolio, stockId, this.httpOptions).pipe(
            tap((result) => {
            }, err => {
                console.log(err);
            })
        );
    }

    toGetPredictions(id): Observable<any> {
        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };
        return this._httpClient.post(getGroupsDetails, { 'group_id': id }, this.httpOptions);
    }
}
