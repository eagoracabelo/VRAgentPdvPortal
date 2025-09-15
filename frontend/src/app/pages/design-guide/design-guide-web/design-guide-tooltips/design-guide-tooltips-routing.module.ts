import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuideWeb } from '../design-guide-web-breadcrumb';
import { DesignGuideTooltipsComponent } from './design-guide-tooltips.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideTooltipsComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuideWeb,
        { text: 'BREADCRUMB.TOOLTIPS' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideTooltipsRoutingModule {}
