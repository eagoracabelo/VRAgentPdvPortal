import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { breadcrumbDesignGuide } from '../../design-guide-breadcrumb';
import { DesignGuidePaletaCoresComponent } from './design-guide-paleta-cores.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuidePaletaCoresComponent,
    data: {
      breadcrumbItems: [
        ...breadcrumbDesignGuide,
        { text: 'BREADCRUMB.PALETA-CORES' },
      ],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuidePaletaCoresRoutingModule {}
