import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class PredictionService implements Resolve<any>
{
    routeParams: any;
    prediction: any;
    onPredictionChanged: BehaviorSubject<any>;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.onPredictionChanged = new BehaviorSubject({});
    }

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any {
        this.routeParams = route.params;

        return new Promise((resolve, reject) => {

            Promise.all([
                this.getPrediction()
            ]).then(
                () => {
                    resolve();
                },
                reject
            );
        });
    }

    /**
     * Get prediction
     *
     * @returns {Promise<any>}
     */
    getPrediction(): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.get('api/e-commerce-orders/' + this.routeParams.id)
                .subscribe((response: any) => {
                    this.prediction = response;
                    this.onPredictionChanged.next(this.prediction);
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Save prediction
     *
     * @param prediction
     * @returns {Promise<any>}
     */
    savePrediction(prediction): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-orders/' + prediction.id, prediction)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }

    /**
     * Add Prediction
     *
     * @param prediction
     * @returns {Promise<any>}
     */
    addPrediction(prediction): Promise<any> {
        return new Promise((resolve, reject) => {
            this._httpClient.post('api/e-commerce-orders/', prediction)
                .subscribe((response: any) => {
                    resolve(response);
                }, reject);
        });
    }
}
