import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuideWeb } from '../design-guide-web-breadcrumb';
import { DesignGuideUtilitiesComponent } from './design-guide-utilities.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideUtilitiesComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuideWeb,
        { text: 'BREADCRUMB.UTILITIES' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideUtilitiesRoutingModule {}
