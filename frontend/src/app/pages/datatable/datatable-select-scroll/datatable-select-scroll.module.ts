import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableSelectScrollRoutingModule } from './datatable-select-scroll-routing.module';
import { DatatableSelectScrollComponent } from './datatable-select-scroll.component';

@NgModule({
  declarations: [DatatableSelectScrollComponent],
  imports: [
    CommonModule,
    DatatableSelectScrollRoutingModule,
    ...commonsImports,
  ],
  providers: [TranslatorPipe],
})
export class DatatableSelectScrollModule {}
