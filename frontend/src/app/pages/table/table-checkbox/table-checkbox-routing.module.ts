import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbtable } from '../table-breadcrumb';
import { TableCheckboxComponent } from './table-checkbox.component';

const routes: Routes = [
  {
    path: '',
    component: TableCheckboxComponent,
    data: {
      breadcrumbItems: [...breadcrumbtable, { text: 'BREADCRUMB.CHECKBOX' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableCheckboxRoutingModule {}
