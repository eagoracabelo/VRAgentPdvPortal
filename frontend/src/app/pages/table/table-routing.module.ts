import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableComponent } from './table.component';

const routes: Routes = [
  {
    path: '',
    component: TableComponent,
    children: [
      {
        path: 'doc',
        loadChildren: () => import('./doc/doc.module').then((m) => m.DocModule),
      },
      {
        path: 'checkbox',
        loadChildren: () =>
          import('./table-checkbox/table-checkbox.module').then(
            (m) => m.TableCheckboxModule,
          ),
      },
      {
        path: 'object',
        loadChildren: () =>
          import('./table-object/table-object.module').then(
            (m) => m.TableObjectModule,
          ),
      },
      { path: '', redirectTo: 'doc', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableRoutingModule {}
