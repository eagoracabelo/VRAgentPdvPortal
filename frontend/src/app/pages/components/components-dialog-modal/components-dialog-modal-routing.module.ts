import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbComponents } from '../components-breadcrumb';
import { ComponentsDialogModalComponent } from './components-dialog-modal.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsDialogModalComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbComponents,
        { text: 'BREADCRUMB.DIALOG-MODAL' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ComponentsDialogModalRoutingModule {}
