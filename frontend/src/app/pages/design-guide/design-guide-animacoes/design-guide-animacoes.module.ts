import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CodeMirrorModule } from '../../../shared/code-mirror/code-mirror.module';
import { DesignGuideAnimacoesRoutingModule } from './design-guide-animacoes-routing.module';
import { DesignGuideAnimacoesComponent } from './design-guide-animacoes.component';

@NgModule({
  declarations: [DesignGuideAnimacoesComponent],
  imports: [CommonModule, DesignGuideAnimacoesRoutingModule, CodeMirrorModule],
})
export class DesignGuideAnimacoesModule {}
