import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from '../../authentication.service';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
  } from '@angular/material';
declare var IN: any;
@Component({
    selector   : 'reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls  : ['./reset-password.component.scss'],
    animations : fuseAnimations
})
export class ResetPasswordComponent implements OnInit, OnDestroy
{
    resetPasswordForm: FormGroup;
    public id: string;
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        private route: ActivatedRoute, private router: Router,
        public snackBar: MatSnackBar,
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
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
    ngOnInit(): void
    {
        this.resetPasswordForm = this._formBuilder.group({
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator,
                Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.resetPasswordForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.resetPasswordForm.get('passwordConfirm').updateValueAndValidity();
            });
        this.id = this.route.snapshot.paramMap.get('id');
        //console.log(this.id)
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
    resetSubmit(){
        console.log('callllll------------');
        if (this.resetPasswordForm.invalid) {
            return false;
        } else {     
            const eptPassword = btoa(this.resetPasswordForm.value.password);                  
            const data = {     
                'userId' : this.id,
                'password' : eptPassword,
            }       
            console.log(data);
            this._authenticationService.changePassword(data).subscribe((result) => {                                            
                this.snackBar.open('Success', 'Your Password Has Been Changed Successfully', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                this.router.navigate(['/pages/auth/login']);
              }, (err) => {                
                if(err){
                    this.snackBar.open('Error', err.error.message, {
                        duration: 2000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                }
            });
        }  
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {'passwordsNotMatching': true};
};
