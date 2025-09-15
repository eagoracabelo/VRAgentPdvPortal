import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableMoveColumnComponent } from './datatable-move-column.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableMoveColumnComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.COLUMN-MOVE' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableMoveColumnRoutingModule {}
