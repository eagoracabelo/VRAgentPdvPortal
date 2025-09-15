import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuide } from '../design-guide-breadcrumb';
import { DesignGuideImagensComponent } from './design-guide-imagens.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideImagensComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuide,
        { text: 'BREADCRUMB.IMAGENS' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideImagensRoutingModule {}
