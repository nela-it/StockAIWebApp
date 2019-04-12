import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { getAlertNotify } from 'appConfig/appconfig';

@Component({
    selector: 'quick-panel',
    templateUrl: './quick-panel.component.html',
    styleUrls: ['./quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class QuickPanelComponent implements OnInit, OnDestroy {
    date: Date;
    events: any[];
    notes: any[];
    alertData: any[];
    settings: any;

    // Private
    private _unsubscribeAll: Subject<any>;
    httpOptions: { headers: any; };

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    ) {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud: false,
            retro: true
        };

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
        // Subscribe to the events
        this._httpClient.get('api/quick-panel-events')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                this.events = response;
            });

        // Subscribe to the notes
        this._httpClient.get('api/quick-panel-notes')
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                this.notes = response;
            });


        this.httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'authorization': localStorage.getItem('LoggedInUser')
            })
        };

        this._httpClient.get(getAlertNotify, this.httpOptions)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((response: any) => {
                this.alertData = response.data;
                console.log(this.alertData);
            });
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
