import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule,MatIconModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { ForgotPasswordComponent } from 'app/main/pages/authentication/forgot-password/forgot-password.component';

const routes = [
    {
        path     : 'auth/forgot-password',
        component: ForgotPasswordComponent
    }
];

@NgModule({
    declarations: [
        ForgotPasswordComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FuseSharedModule
    ]
})
export class ForgotPasswordModule
{
}
