import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthService, SocialLoginModule } from 'angularx-social-login';
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { Md5 } from 'ts-md5/dist/md5';
import { ValidationServiceService } from '../validationService/validation-service.service';
import { AuthenticationService } from '../../authentication.service';
import { from } from 'rxjs';
// import * as CryptoJS from 'crypto-js';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material';
declare var IN: any;
@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    animations: fuseAnimations
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    private user: SocialUser;
    private loggedIn: boolean;
    public error_msg: string;
    // horizontalPosition: MatSnackBarHorizontalPosition = 'start';
    // verticalPosition: MatSnackBarVerticalPosition = 'bottom';
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private _authenticationService: AuthenticationService,
        public _validationServiceService: ValidationServiceService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
    ) {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar: {
                    hidden: true
                },
                toolbar: {
                    hidden: true
                },
                footer: {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', [
                Validators.required,
                Validators.email,
                Validators.pattern('[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}')
            ]],
            password: ['', [Validators.required,
                // Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')
            ]]
        });
    }
    loginSubmit() {
        if (this.loginForm.invalid) {
            return false;
        } else {
            const md5 = new Md5();
            const eptPassword = btoa(this.loginForm.value.password);
            // const encpwd = CryptoJS.AES.encrypt(this.loginForm.value.password, 'Keyishere');
            // console.log("atob-----", btoa("Nihal Koli"));
            // console.log('EncText === ', encpwd.toString());
            const loginData = {
                'apiType': 'login',
                'username': this.loginForm.value.email,
                'password': eptPassword
            };
            this._authenticationService.loginCheck(loginData).subscribe((result) => {
                localStorage.setItem('username', result.username);
                localStorage.setItem('isSubscribed', result.isSubscribed);
                this.snackBar.open('Success', 'You are login successfully', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
                this.router.navigate(['/apps/dashboards/analytics']);
            }, (err) => {
                if (err) {
                    this.snackBar.open('Error', err.error.message, {
                        duration: 2000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                }
            });
        }
    }
    socialLogIn(socialPlatform: string) {
        let socialPlatformProvider;
        if (socialPlatform === 'facebook') {
            socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        } else if (socialPlatform === 'google') {
            socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        } else if (socialPlatform === 'linkedin') {
            socialPlatformProvider = LinkedInLoginProvider.PROVIDER_ID;
        }
        this.authService.signIn(socialPlatformProvider).then(
            (socialData) => {
                const userData = {
                    'apiType': 'socialLogin',
                    'providerData': {
                        'email': socialData.email,
                        'firstName': socialData.firstName,
                        'id': socialData.id,
                        'lastName': socialData.lastName,
                        'username': socialData.name,
                        'provider': socialData.provider
                    }
                };
                this._authenticationService.loginCheck(userData).subscribe((result) => {
                    localStorage.setItem('username', result.username);
                    localStorage.setItem('isSubscribed', result.isSubscribed);
                    this.snackBar.open('Success', 'You are login successfully', {
                        duration: 2000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                    this.router.navigate(['/apps/dashboards/analytics']);
                }, (err) => {
                    console.log(err);
                    if (err) {
                        this.snackBar.open('Error', err.error.message, {
                            duration: 2000,
                            horizontalPosition: 'center',
                            verticalPosition: 'top'
                        });
                    }
                });
                // Now sign-in with userData                  
            }, (err) => {
                console.log(err);
            }
        );
    }
    linkedinlogin() {
        /* bind auth event with getLinkedinUserData */
        IN.Event.on(IN, 'auth', r => {
            this.getLinkedinUserData();
        });

        if (!IN.User.isAuthorized()) {
            /* if not authorised */
            console.log('NOT AUTHORISED');
            /* make authentication */
            IN.User.authorize(r => {
                console.log('IN');
                this.linkedinlogin();
            }, error => {
                console.log('OUT', error);
            });
        } else {
            /* if authorised */
            this.getLinkedinUserData();
        }
    }

    // tslint:disable-next-line:typedef
    getLinkedinUserData() {
        IN.API.Raw('/people/~:(id,first-name,last-name,maiden-name,email-address,headline,picture-url)').result(result => {
            // console.log(result);
            const username = result.firstName + result.lastName;
            const email = `${result.firstName}${result.lastName}@gmail.com`;
            const userData = {
                'apiType': 'socialLogin',
                'providerData': {
                    'email': email,
                    'firstName': result.firstName,
                    'id': result.id,
                    'lastName': result.firstName,
                    'username': username,
                    'provider': 'LINKEDIN'
                }
            };
            // console.log(userData);
            // tslint:disable-next-line:no-shadowed-variable
            this._authenticationService.loginCheck(userData).subscribe((result) => {
                localStorage.setItem('userdata', result.token);
                localStorage.setItem('username', result.username);
                localStorage.setItem('isSubscribed', result.isSubscribed);
                this.snackBar.open('Success', 'You are login successfully', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                });
                this.router.navigate(['/apps/dashboards/analytics']);
            }, (err) => {
                console.log(err);
                if (err) {
                    this.snackBar.open('Error', err.error.message, {
                        duration: 2000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                }
            });
        }).error(error => {
        });
    }
}
