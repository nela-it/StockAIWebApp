import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { predictionGroup, getStockInfo, getAlgorithm, getGroupsDetails, addPortfolio } from 'appConfig/appconfig';
import { tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class StockDetailService implements Resolve<any>{
  widgets: any[];
  stockInfo: any[];
  algorithmInfo: any[];
  alreadyAdded: string;
  httpOptions;
  constructor(private _httpClient: HttpClient) {

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
      this.alreadyAdded = route.params.portfolioFlag;
      Promise.all([
        this.getWidgets(),
        this.getStockInfo(route.params.stockId),
        this.getAlgorithm(route.params.groupId)
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

  getStockInfo(id): Promise<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('LoggedInUser')
      })
    };
    return new Promise((resolve, reject) => {
      this._httpClient.post(getStockInfo, { 'stockId': atob(id) }, this.httpOptions)
        .subscribe((response: any) => {
          this.stockInfo = response.data;
          resolve(response);
        }, reject);
    });
  }
  getAlgorithm(id): Promise<any> {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': localStorage.getItem('LoggedInUser')
      })
    };
    return new Promise((resolve, reject) => {
      this._httpClient.post(getAlgorithm, { 'groupId': atob(id) }, this.httpOptions)
        .subscribe((response: any) => {
          this.algorithmInfo = response.data;
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
}
