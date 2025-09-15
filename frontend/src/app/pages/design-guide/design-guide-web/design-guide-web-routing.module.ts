import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'grid',
        loadChildren: () =>
          import('./design-guide-grid/design-guide-grid.module').then(
            (m) => m.DesignGuideGridModule,
          ),
      },
      {
        path: 'spacing',
        loadChildren: () =>
          import('./design-guide-spacing/design-guide-spacing.module').then(
            (m) => m.DesignGuideSpacingModule,
          ),
      },
      {
        path: 'card',
        loadChildren: () =>
          import('./design-guide-card/design-guide-card.module').then(
            (m) => m.DesignGuideCardModule,
          ),
      },
      {
        path: 'typography',
        loadChildren: () =>
          import(
            './design-guide-typography/design-guide-typography.module'
          ).then((m) => m.DesignGuideTypographyModule),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./design-guide-buttons/design-guide-buttons.module').then(
            (m) => m.DesignGuideButtonsModule,
          ),
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./design-guide-forms/design-guide-forms.module').then(
            (m) => m.DesignGuideFormsModule,
          ),
      },
      {
        path: 'tooltips',
        loadChildren: () =>
          import('./design-guide-tooltips/design-guide-tooltips.module').then(
            (m) => m.DesignGuideTooltipsModule,
          ),
      },
      {
        path: 'tables',
        loadChildren: () =>
          import('./design-guide-tables/design-guide-tables.module').then(
            (m) => m.DesignGuideTablesModule,
          ),
      },
      {
        path: 'pagination',
        loadChildren: () =>
          import(
            './design-guide-pagination/design-guide-pagination.module'
          ).then((m) => m.DesignGuidePaginationModule),
      },
      {
        path: 'lists',
        loadChildren: () =>
          import('./design-guide-lists/design-guide-lists.module').then(
            (m) => m.DesignGuideListsModule,
          ),
      },
      {
        path: 'code',
        loadChildren: () =>
          import('./design-guide-code/design-guide-code.module').then(
            (m) => m.DesignGuideCodeModule,
          ),
      },
      {
        path: 'queries',
        loadChildren: () =>
          import('./design-guide-queries/design-guide-queries.module').then(
            (m) => m.DesignGuideQueriesModule,
          ),
      },
      {
        path: 'utilities',
        loadChildren: () =>
          import('./design-guide-utilities/design-guide-utilities.module').then(
            (m) => m.DesignGuideUtilitiesModule,
          ),
      },
    ],
  },

  { path: '', redirectTo: 'grid', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebRoutingModule {}
