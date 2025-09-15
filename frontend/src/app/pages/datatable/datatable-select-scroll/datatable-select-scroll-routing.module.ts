import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableSelectScrollComponent } from './datatable-select-scroll.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableSelectScrollComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.SELECT-SCROLL' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableSelectScrollRoutingModule {}
