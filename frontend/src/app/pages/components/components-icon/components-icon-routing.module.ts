import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsIconComponent } from './components-icon.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsIconComponent,
    data: {
      breadcrumbItems: [...breadcrumbComponents, { text: 'BREADCRUMB.ICONS' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsIconRoutingModule {}
