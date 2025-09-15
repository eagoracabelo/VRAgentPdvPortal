import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableRowSelectionRoutingModule } from './datatable-row-selection-routing.module';
import { DatatableRowSelectionComponent } from './datatable-row-selection.component';

@NgModule({
  declarations: [DatatableRowSelectionComponent],
  imports: [
    CommonModule,
    DatatableRowSelectionRoutingModule,
    ...commonsImports,
  ],
  providers: [TranslatorPipe],
})
export class DatatableRowSelectionModule {}
