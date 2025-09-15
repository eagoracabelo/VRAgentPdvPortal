import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DesignGuideIconesRoutingModule } from './design-guide-icones-routing.module';
import { DesignGuideIconesComponent } from './design-guide-icones.component';

@NgModule({
  declarations: [DesignGuideIconesComponent],
  imports: [CommonModule, DesignGuideIconesRoutingModule],
})
export class DesignGuideIconesModule {}
