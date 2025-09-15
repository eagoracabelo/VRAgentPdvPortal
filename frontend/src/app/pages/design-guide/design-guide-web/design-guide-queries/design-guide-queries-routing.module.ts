import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuideWeb } from '../design-guide-web-breadcrumb';
import { DesignGuideQueriesComponent } from './design-guide-queries.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideQueriesComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuideWeb,
        { text: 'BREADCRUMB.QUERIES' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideQueriesRoutingModule {}
