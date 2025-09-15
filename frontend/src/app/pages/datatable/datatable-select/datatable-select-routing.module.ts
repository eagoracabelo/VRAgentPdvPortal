import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableSelectComponent } from './datatable-select.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableSelectComponent,
    data: {
      breadcrumbItems: [...breadcrumbDatatable, { text: 'BREADCRUMB.SELECT' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableSelectRoutingModule {}
