import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PredictionListService implements Resolve<any>
{
    predictions: any[];
    onPredictionsChanged: BehaviorSubject<any>;
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
                'authorization': localStorage.getItem('userdata')
            })
        };
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
                this.getPredictions()
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
    getPredictions(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/e-commerce-orders')
                .subscribe((response: any) => {
                    this.predictions = response;
                    this.onPredictionsChanged.next(this.predictions);
                    resolve(response);
                }, reject);
        });
    }

    // getPredictions(): Promise<any> {
    //     return new Promise((resolve, reject) => {
    //         this._httpClient.post(getGroupsDetails, { 'group_id': btoa('1') }, this.httpOptions)
    //             .subscribe((response: any) => {
    //                 this.predictions = response;
    //                 this.onPredictionsChanged.next(this.predictions);
    //                 resolve(response);
    //             }, reject);
    //     });
    // }
}


