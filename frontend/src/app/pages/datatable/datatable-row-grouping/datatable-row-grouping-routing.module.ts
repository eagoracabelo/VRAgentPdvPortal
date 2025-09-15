import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableRowGroupingComponent } from './datatable-row-grouping.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableRowGroupingComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.ROW-GROUPING' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableRowGroupingRoutingModule {}
