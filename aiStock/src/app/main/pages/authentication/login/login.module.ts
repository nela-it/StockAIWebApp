import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatSnackBarModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { AuthService } from 'angularx-social-login';
import { FuseSharedModule } from '@fuse/shared.module';
import { LoginComponent } from 'app/main/pages/authentication/login/login.component';
import { ValidationServiceService } from '../validationService/validation-service.service';

const routes = [
    {
        path: 'auth/login',
        component: LoginComponent
    }
];
@NgModule({
    declarations: [
        LoginComponent
    ],
    imports: [
        RouterModule.forChild(routes),
        MatIconModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatInputModule,
        FuseSharedModule
    ],
    providers: [
        AuthService,
        ValidationServiceService
    ],
})

export class LoginModule {
}
