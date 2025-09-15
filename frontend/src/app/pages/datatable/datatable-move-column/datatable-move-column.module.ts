import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableMoveColumnRoutingModule } from './datatable-move-column-routing.module';
import { DatatableMoveColumnComponent } from './datatable-move-column.component';

@NgModule({
  declarations: [DatatableMoveColumnComponent],
  imports: [CommonModule, DatatableMoveColumnRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableMoveColumnModule {}
