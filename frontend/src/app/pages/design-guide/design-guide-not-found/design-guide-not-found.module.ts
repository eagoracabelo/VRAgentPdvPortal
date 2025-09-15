import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DesignGuideNotFoundRoutingModule } from './design-guide-not-found-routing.module';
import { DesignGuideNotFoundComponent } from './design-guide-not-found.component';

@NgModule({
  declarations: [DesignGuideNotFoundComponent],
  imports: [CommonModule, DesignGuideNotFoundRoutingModule],
})
export class DesignGuideNotFoundModule {}
