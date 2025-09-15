import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DesignGuideRoutingModule } from './design-guide-routing.module';
import { DesignGuideComponent } from './design-guide.component';

@NgModule({
  declarations: [DesignGuideComponent],
  imports: [CommonModule, DesignGuideRoutingModule],
})
export class DesignGuideModule {}
