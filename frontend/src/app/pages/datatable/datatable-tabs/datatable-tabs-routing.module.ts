import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableTabsComponent } from './datatable-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableTabsComponent,
    data: {
      breadcrumbItems: [...breadcrumbDatatable, { text: 'BREADCRUMB.TABS' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableTabsRoutingModule {}
