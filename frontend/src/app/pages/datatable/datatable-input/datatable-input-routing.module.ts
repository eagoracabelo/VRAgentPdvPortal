import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableInputComponent } from './datatable-input.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableInputComponent,
    data: {
      breadcrumbItems: [...breadcrumbDatatable, { text: 'BREADCRUMB.INPUT' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableInputRoutingModule {}
