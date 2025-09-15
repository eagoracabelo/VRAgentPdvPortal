import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsRadioButtonComponent } from './components-radio-button.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsRadioButtonComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.RADIOBUTTON' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsRadioButtonRoutingModule {}
