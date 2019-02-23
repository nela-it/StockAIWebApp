import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDialogModule, MatIconModule, MatSnackBarModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { RegisterComponent, TeamAndConditions } from 'app/main/pages/authentication/register/register.component';

const routes = [
    {
        path: 'auth/register',
        component: RegisterComponent
    }
];

@NgModule({
    declarations: [
        RegisterComponent,
        TeamAndConditions
    ],
    imports: [
        RouterModule.forChild(routes),
        MatSnackBarModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatDialogModule,
        MatInputModule,
        MatIconModule,
        FuseSharedModule
    ], entryComponents: [
        TeamAndConditions
    ]
})
export class RegisterModule {
}
