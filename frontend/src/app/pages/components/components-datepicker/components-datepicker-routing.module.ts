import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsDatepickerComponent } from './components-datepicker.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsDatepickerComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.DATEPICKER' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsDatepickerRoutingModule {}
