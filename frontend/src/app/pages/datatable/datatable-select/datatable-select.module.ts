import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableSelectRoutingModule } from './datatable-select-routing.module';
import { DatatableSelectComponent } from './datatable-select.component';

@NgModule({
  declarations: [DatatableSelectComponent],
  imports: [CommonModule, DatatableSelectRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableSelectModule {}
