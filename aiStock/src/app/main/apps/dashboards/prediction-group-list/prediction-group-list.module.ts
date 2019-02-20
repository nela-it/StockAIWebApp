import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule, MatGridListModule, MatFormFieldModule, MatCardModule, MatIconModule, MatMenuModule, MatSelectModule, MatTabsModule } from '@angular/material';
import { AgmCoreModule } from '@agm/core';
import { ChartsModule } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseWidgetModule } from '@fuse/components/widget/widget.module';
import { PredictionGroupListComponent } from './prediction-group-list.component';
import { PredictionGroupListcomponentService } from './prediction-group-list.component.service';

const routes: Routes = [
  {
    path: '**',
    component: PredictionGroupListComponent,
    resolve: {
      data: PredictionGroupListcomponentService
    }
  }
];

@NgModule({
  declarations: [
    PredictionGroupListComponent
  ],
  imports: [
    RouterModule.forChild(routes),

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
    PredictionGroupListcomponentService
  ]
})
export class PredictionGroupListModule { }
