import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsSelectComponent } from './components-select.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsSelectComponent,
    data: {
      breadcrumbItems: [...breadcrumbComponents, { text: 'BREADCRUMB.SELECT' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsSelectRoutingModule {}
