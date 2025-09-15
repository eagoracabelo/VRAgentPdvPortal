import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DesignGuideLogosComponent } from './design-guide-logos/design-guide-logos.component';
import { DesignGuidePaletaCoresComponent } from './design-guide-paleta-cores/design-guide-paleta-cores.component';
import { DesignGuideProdutosRoutingModule } from './design-guide-produtos-routing.module';

@NgModule({
  declarations: [DesignGuideLogosComponent, DesignGuidePaletaCoresComponent],
  imports: [CommonModule, DesignGuideProdutosRoutingModule],
})
export class DesignGuideProdutosModule {}
