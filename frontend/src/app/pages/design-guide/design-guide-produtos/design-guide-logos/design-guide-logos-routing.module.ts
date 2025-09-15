import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuide } from '../../design-guide-breadcrumb';
import { DesignGuideLogosComponent } from './design-guide-logos.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideLogosComponent,
    data: {
      breadcrumbItems: [...breadcrumbDesignGuide, { text: 'BREADCRUMB.LOGOS' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideLogosRoutingModule {}
