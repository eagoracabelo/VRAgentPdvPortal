import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuide } from '../design-guide-breadcrumb';
import { DesignGuideAnimacoesComponent } from './design-guide-animacoes.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideAnimacoesComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuide,
        { text: 'BREADCRUMB.ANIMACOES' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideAnimacoesRoutingModule {}
