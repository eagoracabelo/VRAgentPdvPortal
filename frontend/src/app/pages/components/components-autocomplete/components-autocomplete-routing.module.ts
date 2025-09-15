import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsAutocompleteComponent } from './components-autocomplete.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsAutocompleteComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.AUTOCOMPLETE' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsAutocompleteRoutingModule {}
