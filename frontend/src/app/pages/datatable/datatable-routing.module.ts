import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatatableComponent } from './datatable.component';

const routes: Routes = [
  {
    path: '',
    component: DatatableComponent,
    children: [
      {
        path: 'doc',
        loadChildren: () => import('./doc/doc.module').then((m) => m.DocModule),
      },
      {
        path: 'basico',
        loadChildren: () =>
          import('./datatable-basico/datatable-basico.module').then(
            (m) => m.DatatableBasicoModule,
          ),
      },
      {
        path: 'checkbox',
        loadChildren: () =>
          import('./datatable-checkbox/datatable-checkbox.module').then(
            (m) => m.DatatableCheckboxModule,
          ),
      },
      {
        path: 'formatacoes',
        loadChildren: () =>
          import('./datatable-data-type/datatable-data-type.module').then(
            (m) => m.DatatableDataTypeModule,
          ),
      },
      {
        path: 'column-move',
        loadChildren: () =>
          import('./datatable-move-column/datatable-move-column.module').then(
            (m) => m.DatatableMoveColumnModule,
          ),
      },
      {
        path: 'custom-page-size',
        loadChildren: () =>
          import('./datatable-page-size/datatable-page-size.module').then(
            (m) => m.DatatablePageSizeModule,
          ),
      },
      {
        path: 'translation',
        loadChildren: () =>
          import('./datatable-translation/datatable-translation.module').then(
            (m) => m.DatatableTranslationModule,
          ),
      },
      {
        path: 'row-selection',
        loadChildren: () =>
          import(
            './datatable-row-selection/datatable-row-selection.module'
          ).then((m) => m.DatatableRowSelectionModule),
      },
      {
        path: 'column-group',
        loadChildren: () =>
          import('./datatable-column-group/datatable-column-group.module').then(
            (m) => m.DatatableColumnGroupModule,
          ),
      },
      {
        path: 'row-group',
        loadChildren: () =>
          import('./datatable-row-grouping/datatable-row-grouping.module').then(
            (m) => m.DatatableRowGroupingModule,
          ),
      },
      {
        path: 'select',
        loadChildren: () =>
          import('./datatable-select/datatable-select.module').then(
            (m) => m.DatatableSelectModule,
          ),
      },
      {
        path: 'select-scroll',
        loadChildren: () =>
          import(
            './datatable-select-scroll/datatable-select-scroll.module'
          ).then((m) => m.DatatableSelectScrollModule),
      },
      {
        path: 'tabs',
        loadChildren: () =>
          import('./datatable-tabs/datatable-tabs.module').then(
            (m) => m.DatatableTabsModule,
          ),
      },
      {
        path: 'server-scrolling',
        loadChildren: () =>
          import(
            './datatable-server-scrolling/datatable-server-scrolling.module'
          ).then((m) => m.DatatableServerScrollingModule),
      },
      {
        path: 'tree',
        loadChildren: () =>
          import('./datatable-tree/datatable-tree.module').then(
            (m) => m.DatatableTreeModule,
          ),
      },
      {
        path: 'input',
        loadChildren: () =>
          import('./datatable-input/datatable-input.module').then(
            (m) => m.DatatableInputModule,
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
export class DatatablesRoutingModule {}
