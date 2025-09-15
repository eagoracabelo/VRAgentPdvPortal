import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsTextEditorComponent } from './components-text-editor.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsTextEditorComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.TEXT-EDITOR' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsTextEditorRoutingModule {}
