import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuideWeb } from '../design-guide-web-breadcrumb';
import { DesignGuideSpacingComponent } from './design-guide-spacing.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideSpacingComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuideWeb,
        { text: 'BREADCRUMB.SPACING' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideSpacingRoutingModule {}
