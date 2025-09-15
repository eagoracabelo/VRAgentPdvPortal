import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableRowGroupingRoutingModule } from './datatable-row-grouping-routing.module';
import { DatatableRowGroupingComponent } from './datatable-row-grouping.component';

@NgModule({
  declarations: [DatatableRowGroupingComponent],
  imports: [CommonModule, DatatableRowGroupingRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableRowGroupingModule {}
