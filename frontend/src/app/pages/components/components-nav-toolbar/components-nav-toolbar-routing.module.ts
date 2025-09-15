import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsNavToolbarComponent } from './components-nav-toolbar.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsNavToolbarComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.NAV-TOOLBAR' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsNavToolbarRoutingModule {}
