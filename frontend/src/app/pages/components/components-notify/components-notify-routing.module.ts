import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsNotifyComponent } from './components-notify.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsNotifyComponent,
    data: {
      breadcrumbItems: [...breadcrumbComponents, { text: 'BREADCRUMB.NOTIFY' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsNotifyRoutingModule {}
