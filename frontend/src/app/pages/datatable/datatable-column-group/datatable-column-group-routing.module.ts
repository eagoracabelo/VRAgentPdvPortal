import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableColumnGroupComponent } from './datatable-column-group.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableColumnGroupComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.COLUMN-GROUP' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableColumnGroupRoutingModule {}
