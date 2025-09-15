import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuideWeb } from '../design-guide-web-breadcrumb';
import { DesignGuideTypographyComponent } from './design-guide-typography.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideTypographyComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuideWeb,
        { text: 'BREADCRUMB.TYPOGRAPHY' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideTypographyRoutingModule {}
