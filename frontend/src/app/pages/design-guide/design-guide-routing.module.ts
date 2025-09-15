import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesignGuideComponent } from './design-guide.component';

const routes: Routes = [
  {
    path: '',
    component: DesignGuideComponent,
    children: [
      {
        path: 'doc',
        loadChildren: () => import('./doc/doc.module').then((m) => m.DocModule),
      },
      {
        path: 'produtos',
        loadChildren: () =>
          import('./design-guide-produtos/design-guide-produtos.module').then(
            (m) => m.DesignGuideProdutosModule,
          ),
      },
      {
        path: 'icones',
        loadChildren: () =>
          import('./design-guide-icones/design-guide-icones.module').then(
            (m) => m.DesignGuideIconesModule,
          ),
      },
      {
        path: 'imagens',
        loadChildren: () =>
          import('./design-guide-imagens/design-guide-imagens.module').then(
            (m) => m.DesignGuideImagensModule,
          ),
      },
      {
        path: 'animacoes',
        loadChildren: () =>
          import('./design-guide-animacoes/design-guide-animacoes.module').then(
            (m) => m.DesignGuideAnimacoesModule,
          ),
      },
      {
        path: 'web',
        loadChildren: () =>
          import('./design-guide-web/design-guide-web.module').then(
            (m) => m.DesignGuideWebModule,
          ),
      },
      { path: '', redirectTo: 'doc', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DesignGuideRoutingModule {}
