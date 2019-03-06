import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatFormFieldModule, MatBadgeModule, MatIconModule, MatMenuModule, MatToolbarModule, MatFormField } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { ToolbarComponent } from 'app/layout/components/toolbar/toolbar.component';

@NgModule({
    declarations: [
        ToolbarComponent
    ],
    imports: [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,
        MatBadgeModule,
        MatFormFieldModule,
        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports: [
        ToolbarComponent
    ]
})
export class ToolbarModule {
}
