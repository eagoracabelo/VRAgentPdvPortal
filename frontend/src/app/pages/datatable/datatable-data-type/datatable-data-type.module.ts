import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableDataTypeRoutingModule } from './datatable-data-type-routing.module';
import { DatatableDataTypeComponent } from './datatable-data-type.component';

@NgModule({
  declarations: [DatatableDataTypeComponent],
  imports: [CommonModule, DatatableDataTypeRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableDataTypeModule {}
