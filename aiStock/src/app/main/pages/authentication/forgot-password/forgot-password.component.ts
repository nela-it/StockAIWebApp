import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { ValidationServiceService } from '../validationService/validation-service.service';
import { AuthenticationService } from '../../authentication.service';
import {
    MatSnackBar,
    MatSnackBarHorizontalPosition,
    MatSnackBarVerticalPosition,
  } from '@angular/material';
declare var IN: any;
@Component({
    selector   : 'forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls  : ['./forgot-password.component.scss'],
    animations : fuseAnimations
})
export class ForgotPasswordComponent implements OnInit
{
    forgotPasswordForm: FormGroup;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private _authenticationService: AuthenticationService,
        public _validationServiceService : ValidationServiceService,
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
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email,Validators.pattern('[\\w\\.-]+@[\\w\\.-]+\\.\\w{2,4}')]]
        });
    }
    loginSubmit() {
        console.log('callllll------------');
        if (this.forgotPasswordForm.invalid) {
            return false;
        } else {            
            const loginData = {               
                'email' : this.forgotPasswordForm.value.email,               
            }           
            this._authenticationService.emailCheck(loginData).subscribe((result) => {                            
                localStorage.setItem('userdata',result.token);
                this.snackBar.open('Success', 'Please check your mail to reset password', {
                    duration: 2000,
                    horizontalPosition: 'center',
                    verticalPosition: 'top'
                  });
                //this.router.navigate(['/apps/dashboards/analytics']);
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
