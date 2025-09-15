import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuide } from '../design-guide-breadcrumb';
import { DesignGuideNotFoundComponent } from './design-guide-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideNotFoundComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuide,
        { text: 'BREADCRUMB.NOT-FOUND' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideNotFoundRoutingModule {}
