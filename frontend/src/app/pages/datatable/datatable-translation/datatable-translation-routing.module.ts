import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDatatable } from '../datatable-breadcrumb';
import { DatatableTranslationComponent } from './datatable-translation.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableTranslationComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDatatable,
        { text: 'BREADCRUMB.TRANSLATION' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatatableTranslationRoutingModule {}
