import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsTabsComponent } from './components-tabs.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsTabsComponent,
    data: {
      breadcrumbItems: [...breadcrumbComponents, { text: 'BREADCRUMB.TABS' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsTabsRoutingModule {}
