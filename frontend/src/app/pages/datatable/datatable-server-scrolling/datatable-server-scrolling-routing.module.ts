import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableServerScrollingComponent } from './datatable-server-scrolling.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableServerScrollingComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.SERVER-SCROLLING' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableServerScrollingRoutingModule {}
