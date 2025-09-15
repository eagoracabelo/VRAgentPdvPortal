import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MinionsListComponent } from './pages/minions-list/minions-list.component';

@NgModule({
    declarations: [
        MinionsListComponent
    ],
    imports: [
        SharedModule,
        RouterModule
    ],
    exports: [
        MinionsListComponent
    ]
})
export class MinionsModule { }