import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableBasicoComponent } from './datatable-basico.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableBasicoComponent,
    data: {
      breadcrumbItems: [...breadcrumbDatatable, { text: 'BREADCRUMB.BASICO' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableBasicoRoutingModule {}
