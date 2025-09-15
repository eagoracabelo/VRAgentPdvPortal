import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableDataTypeComponent } from './datatable-data-type.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableDataTypeComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.FORMATACOES' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableDataTypeRoutingModule {}
