import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { DocComponent } from './doc.component';

const routes: Routes = [
  {
    path: '',
    component: DocComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'COMMONS.DOCUMENTATION' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocRoutingModule {}
