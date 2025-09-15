import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ComponentsComponent } from './components.component';

const routes: Routes = [
  {
    path: '',
    component: ComponentsComponent,
    children: [
      {
        path: 'doc',
        loadChildren: () => import('./doc/doc.module').then((m) => m.DocModule),
      },
      {
        path: 'forms',
        children: [
          {
            path: 'autocomplete',
            loadChildren: () =>
              import(
                './components-autocomplete/components-autocomplete.module'
              ).then((m) => m.ComponentsAutocompleteModule),
          },
          {
            path: 'checkbox',
            loadChildren: () =>
              import('./components-checkbox/components-checkbox.module').then(
                (m) => m.ComponentsCheckboxModule,
              ),
          },
          {
            path: 'datepicker',
            loadChildren: () =>
              import(
                './components-datepicker/components-datepicker.module'
              ).then((m) => m.ComponentsDatepickerModule),
          },
          {
            path: 'input',
            loadChildren: () =>
              import('./components-input/components-input.module').then(
                (m) => m.ComponentsInputModule,
              ),
          },
          {
            path: 'radiobutton',
            loadChildren: () =>
              import(
                './components-radio-button/components-radio-button.module'
              ).then((m) => m.ComponentsRadioButtonModule),
          },
          {
            path: 'select',
            loadChildren: () =>
              import('./components-select/components-select.module').then(
                (m) => m.ComponentsSelectModule,
              ),
          },
          {
            path: 'textarea',
            loadChildren: () =>
              import('./components-textarea/components-textarea.module').then(
                (m) => m.ComponentsTextareaModule,
              ),
          },
          {
            path: 'treeselect',
            loadChildren: () =>
              import(
                './components-tree-select/components-tree-select.module'
              ).then((m) => m.ComponentsTreeSelectModule),
          },
          {
            path: 'treeview',
            loadChildren: () =>
              import('./components-tree-view/components-tree-view.module').then(
                (m) => m.ComponentsTreeViewModule,
              ),
          },
          { path: '', redirectTo: 'autocomplete', pathMatch: 'full' },
        ],
      },
      {
        path: 'side-modal',
        loadChildren: () =>
          import('./components-side-modal/components-side-modal.module').then(
            (m) => m.ComponentsSideModalModule,
          ),
      },
      {
        path: 'card-value',
        loadChildren: () =>
          import('./components-card-value/components-card-value.module').then(
            (m) => m.ComponentsCardValueModule,
          ),
      },
      {
        path: 'notify',
        loadChildren: () =>
          import('./components-notify/components-notify.module').then(
            (m) => m.ComponentsNotifyModule,
          ),
      },
      {
        path: 'icon',
        loadChildren: () =>
          import('./components-icon/components-icon.module').then(
            (m) => m.ComponentsIconModule,
          ),
      },
      {
        path: 'tabs',
        loadChildren: () =>
          import('./components-tabs/components-tabs.module').then(
            (m) => m.ComponentsTabsModule,
          ),
      },
      {
        path: 'tooltip',
        loadChildren: () =>
          import('./components-tooltip/components-tooltip.module').then(
            (m) => m.ComponentsTooltipModule,
          ),
      },
      {
        path: 'nav-toolbar',
        loadChildren: () =>
          import('./components-nav-toolbar/components-nav-toolbar.module').then(
            (m) => m.ComponentsNavToolbarModule,
          ),
      },
      {
        path: 'modal',
        children: [
          {
            path: 'dialog-modal',
            loadChildren: () =>
              import(
                './components-dialog-modal/components-dialog-modal.module'
              ).then((m) => m.ComponentsDialogModalModule),
          },
          {
            path: 'dialog-modal-custom',
            loadChildren: () =>
              import(
                './components-dialog-modal-custom/dialog-modal-custom.module'
              ).then((m) => m.ComponentsDialogModalCustomModule),
          },
          { path: '', redirectTo: 'dialog-modal', pathMatch: 'full' },
        ],
      },
      {
        path: 'text-editor',
        loadChildren: () =>
          import('./components-text-editor/components-text-editor.module').then(
            (m) => m.ComponentsTextEditorModule,
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
export class ComponentsRoutingModule {}
