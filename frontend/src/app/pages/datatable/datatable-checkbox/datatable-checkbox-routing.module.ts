import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableCheckboxComponent } from './datatable-checkbox.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableCheckboxComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.CHECKBOX' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableCheckboxRoutingModule {}
