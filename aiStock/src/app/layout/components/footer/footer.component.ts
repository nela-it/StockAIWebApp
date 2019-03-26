import { Component } from '@angular/core';

@Component({
    selector: 'footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    username: any;
    userlogin = false;
    /**
     * Constructor
     */
    constructor() {
    }
    ngOnInit(): void {
        this.username = localStorage.getItem('username');
        if (this.username) {
            this.userlogin = true;
        }
    }
}
