import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DesignGuideImagensRoutingModule } from './design-guide-imagens-routing.module';
import { DesignGuideImagensComponent } from './design-guide-imagens.component';

@NgModule({
  declarations: [DesignGuideImagensComponent],
  imports: [CommonModule, DesignGuideImagensRoutingModule],
})
export class DesignGuideImagensModule {}
