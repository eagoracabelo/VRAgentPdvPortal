import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'paleta',
        loadChildren: () =>
          import(
            './design-guide-paleta-cores/design-guide-paleta-cores.module'
          ).then((m) => m.DesignGuidePaletaCoresModule),
      },
      {
        path: 'logos',
        loadChildren: () =>
          import('./design-guide-logos/design-guide-logos.module').then(
            (m) => m.DesignGuideLogosModule,
          ),
      },
    ],
  },

  { path: '', redirectTo: 'paleta', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideProdutosRoutingModule {}
