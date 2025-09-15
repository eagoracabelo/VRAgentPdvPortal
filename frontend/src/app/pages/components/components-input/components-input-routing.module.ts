import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsInputComponent } from './components-input.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsInputComponent,
    data: {
      breadcrumbItems: [...breadcrumbComponents, { text: 'BREADCRUMB.INPUT' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsInputRoutingModule {}
