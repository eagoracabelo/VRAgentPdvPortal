import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VruiComponent } from './vrui.component';

const routes: Routes = [
  {
    path: '',
    component: VruiComponent,
    children: [
      {
        path: 'doc',
        loadChildren: () => import('./doc/doc.module').then((m) => m.DocModule),
      },
      { path: '', redirectTo: 'doc', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VruiRoutingModule {}
