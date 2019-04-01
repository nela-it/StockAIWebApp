import { Component, OnDestroy, OnInit } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';

import { ProfileService } from '../../profile.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as _ from 'underscore'

@Component({
    selector: 'profile-photos-videos',
    templateUrl: './photos-videos.component.html',
    styleUrls: ['./photos-videos.component.scss'],
    animations: fuseAnimations
})
export class ProfilePhotosVideosComponent implements OnInit, OnDestroy {
    photosVideos: any;
    subscriptionDetail: any;
    subscriptionAmount: any;
    paymentID: any;
    paymentDate: any;
    errMsg;
    isSubscribed: boolean = true;
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ProfileService} _profileService
     */
    constructor(
        private _profileService: ProfileService
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
        this._profileService.photosVideosOnChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(photosVideos => {
                this.photosVideos = photosVideos;
            });
        this._profileService.getUserInfo().subscribe(res => {

            if (Object.keys(res.payment_detail).length !== 0) {
                // console.log('true')
                this.isSubscribed = true;
                this.subscriptionAmount = res.payment_detail['subscription_amount'];
                this.paymentDate = res.payment_detail['createdAt'];
                this.subscriptionDetail = JSON.parse(res.payment_detail['subscription_details']);
                this.paymentID = this.subscriptionDetail.paymentId;
            } else {
                // console.log('false')
                this.isSubscribed = false;
            }

        }, error => {
            console.log(error);
            this.errMsg = error.message;
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
