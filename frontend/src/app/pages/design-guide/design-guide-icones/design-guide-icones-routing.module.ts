import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuide } from '../design-guide-breadcrumb';
import { DesignGuideIconesComponent } from './design-guide-icones.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideIconesComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuide,
        { text: 'BREADCRUMB.ICONES' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideIconesRoutingModule {}
