import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { MatChipsModule, MatInputModule, MatPaginatorModule, MatRippleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatButtonModule, MatGridListModule, MatFormFieldModule, MatCardModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';

import { AnalyticsDashboardComponent } from 'app/main/apps/dashboards/analytics/analytics.component';
import { AnalyticsDashboardService } from 'app/main/apps/dashboards/analytics/analytics.service';
import { PredictionListComponent } from './prediction/prediction.component';
import { PredictionListService } from './prediction/prediction.service';
import { AuthGuard } from '../../../../auth.guard';
import { StockDetailComponent } from './stock-detail/stock-detail.component';

const routes: Routes = [
    {
        path: '',
        component: AnalyticsDashboardComponent,
        resolve: {
            data: AnalyticsDashboardService
        }
    },
    {
        path: 'prediction/:id',
        component: PredictionListComponent,
        canActivate: [AuthGuard],
        resolve: {
            data: PredictionListService
        }
    },
    {
        path: 'stockDetail',
        component: StockDetailComponent,
        canActivate: [AuthGuard],
        /* resolve: {
            data: PredictionListService
        } */
    },

];

@NgModule({
    declarations: [
        AnalyticsDashboardComponent,
        PredictionListComponent,
        StockDetailComponent,

    ],
    imports: [
        RouterModule.forChild(routes),
        MatChipsModule,
        MatInputModule,
        MatPaginatorModule,
        MatRippleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatMenuModule,
        MatSelectModule,
        MatTabsModule,
        MatCardModule,
        MatGridListModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyD81ecsCj4yYpcXSLFcYU97PvRsE_X8Bx8'
        }),
        ChartsModule,
        NgxChartsModule,

        FuseSharedModule,
        FuseWidgetModule
    ],
    providers: [
        AnalyticsDashboardService, PredictionListService
    ]
})
export class AnalyticsDashboardModule {
}

