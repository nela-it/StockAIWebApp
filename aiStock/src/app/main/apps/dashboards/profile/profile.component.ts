import { Component, ViewEncapsulation } from '@angular/core';

import { fuseAnimations } from '@fuse/animations';
import { ProfileService } from './profile.service'
@Component({
    selector: 'profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ProfileComponent {
    username: any;
    isAdmin: any;

    /**
     * Constructor
     */
    constructor(public _profileService: ProfileService) {

    }
    ngOnInit(): void {
        this.username = localStorage.getItem('username');
        this._profileService.getUserInfo().subscribe(res => {
            this.isAdmin = res.data.isAdmin;
        }, error => {
            console.log(error);
        });

    }
}
