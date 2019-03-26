import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from "angularx-social-login";
import { AuthenticationService } from '../../authentication.service'
import { FacebookLoginProvider, GoogleLoginProvider, LinkedInLoginProvider } from "angularx-social-login";
import {
    MatSnackBar,
    MatDialog,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
} from '@angular/material';
declare var IN: any;
@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    animations: fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    public error_msg: string;
    termsFlag: any;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private authService: AuthService,
        private _authenticationService: AuthenticationService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
        public dialog: MatDialog
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
        this.registerForm = this._formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email,
            Validators.pattern('[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}')]],
            password: ['', [Validators.required,
            Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]
            ],
            terms: ['', Validators.required]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        /* this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            }); */
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    registerSubmit() {

        if (this.registerForm.invalid) {
            this.termsFlag = this.registerForm.value.terms;
            return false;
        } else {
            const eptPassword = btoa(this.registerForm.value.password);
            const registerData = {
                'apiType': 'register',
                'email': this.registerForm.value.email,
                'username': this.registerForm.value.name,
                'password': eptPassword
            }
            this._authenticationService.registerUser(registerData).subscribe((result) => {
                localStorage.setItem('username', result.username);

                this.snackBar.open('Success', 'You are register successfully', {
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
    //Login with social 
    socialSignIn(socialPlatform: string) {
        let socialPlatformProvider;
        if (socialPlatform == "facebook") {
            socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
        } else if (socialPlatform == "google") {
            socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
        } else if (socialPlatform == "linkedin") {
            socialPlatformProvider = LinkedInLoginProvider.PROVIDER_ID;
        }
        this.authService.signIn(socialPlatformProvider).then(
            (socialData) => {
                const userData = {
                    'apiType': 'socialRegister',
                    'providerData': {
                        'email': socialData.email,
                        'firstName': socialData.firstName,
                        'id': socialData.id,
                        'lastName': socialData.lastName,
                        'username': socialData.name,
                        'provider': socialData.provider
                    }
                }
                this._authenticationService.registerUser(userData).subscribe((result) => {
                    localStorage.setItem('username', result.username);

                    this.snackBar.open('Success', 'You are register successfully', {
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
                // Now sign-in with userData                  
            }, (err) => {
                console.log(err)
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
        IN.API.Raw('/people/~:(id,first-name,last-name,email-address,headline,picture-url)').result(result => {
            //console.log(result);
            const username = result.firstName + result.lastName;
            const email = result.firstName + '121' + result.lastName + '@gmail.com';
            const userData = {
                "apiType": 'socialRegister',
                "providerData": {
                    "email": email,
                    "firstName": result.firstName,
                    "id": result.id,
                    "lastName": result.firstName,
                    "username": username,
                    "provider": "LINKEDIN"
                }
            }
            //console.log(userData);
            this._authenticationService.registerUser(userData).subscribe((result) => {
                localStorage.setItem('username', result.username);

                this.snackBar.open('Success', 'You are register successfully', {
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

    openDialog() {
        const dialogRef = this.dialog.open(TeamAndConditions);

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if (!control.parent || !control) {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if (!password || !passwordConfirm) {
        return null;
    }

    if (passwordConfirm.value === '') {
        return null;
    }

    if (password.value === passwordConfirm.value) {
        return null;
    }

    return { 'passwordsNotMatching': true };
};

@Component({
    selector: 'TeamAndConditions',
    templateUrl: 'TeamAndConditions.html',
})
export class TeamAndConditions { }