import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbtable } from '../table-breadcrumb';
import { TableObjectComponent } from './table-object.component';

const routes: Routes = [
  {
    path: '',
    component: TableObjectComponent,
    data: {
      breadcrumbItems: [...breadcrumbtable, { text: 'BREADCRUMB.OBJECT' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableObjectRoutingModule {}
