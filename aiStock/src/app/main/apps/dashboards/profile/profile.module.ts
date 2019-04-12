import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatDividerModule, MatIconModule, MatSnackBarModule, MatTabsModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { ProfileService } from 'app/main/apps/dashboards/profile/profile.service';
import { ProfileComponent } from 'app/main/apps/dashboards/profile/profile.component';
import { ProfileTimelineComponent } from 'app/main/apps/dashboards/profile/tabs/timeline/timeline.component';
import { ProfileAboutComponent } from 'app/main/apps/dashboards/profile/tabs/about/about.component';
import { ProfilePhotosVideosComponent } from 'app/main/apps/dashboards/profile/tabs/photos-videos/photos-videos.component';


const routes = [
    {
        path: '**',
        component: ProfileComponent,
        resolve: {
            profile: ProfileService
        }
    }
];

@NgModule({
    declarations: [
        ProfileComponent,
        ProfileTimelineComponent,
        ProfileAboutComponent,
        ProfilePhotosVideosComponent
    ],
    imports: [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatTabsModule,
        MatSnackBarModule,

        FuseSharedModule
    ],
    providers: [
        ProfileService
    ]
})
export class ProfileModule {
}
