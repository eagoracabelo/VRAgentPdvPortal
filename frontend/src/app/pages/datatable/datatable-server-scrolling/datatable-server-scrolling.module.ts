import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableServerScrollingRoutingModule } from './datatable-server-scrolling-routing.module';
import { DatatableServerScrollingComponent } from './datatable-server-scrolling.component';

@NgModule({
  declarations: [DatatableServerScrollingComponent],
  imports: [
    CommonModule,
    DatatableServerScrollingRoutingModule,
    ...commonsImports,
  ],
  providers: [TranslatorPipe],
})
export class DatatableServerScrollingModule {}
