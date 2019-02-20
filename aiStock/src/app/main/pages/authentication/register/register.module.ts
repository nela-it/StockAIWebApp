import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule,MatIconModule,MatSnackBarModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { RegisterComponent } from 'app/main/pages/authentication/register/register.component';

const routes = [
    {
        path     : 'auth/register',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [
        RegisterComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        FuseSharedModule
    ]
})
export class RegisterModule
{
}
