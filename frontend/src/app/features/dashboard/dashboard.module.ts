import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MinionsModule } from '../minions/minions.module'; // Importar o MinionsModule
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
    declarations: [
        DashboardComponent
    ],
    imports: [
        SharedModule,
        RouterModule,
        MinionsModule
    ]
})
export class DashboardModule { }