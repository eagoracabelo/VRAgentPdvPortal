import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsCheckboxComponent } from './components-checkbox.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsCheckboxComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.CHECKBOX' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsCheckboxRoutingModule {}
