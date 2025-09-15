import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsDialogModalCustomComponent } from './components-dialog-modal-custom.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsDialogModalCustomComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.DIALOG-MODAL-CUSTOM' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsDialogModalCustomRoutingModule {}
