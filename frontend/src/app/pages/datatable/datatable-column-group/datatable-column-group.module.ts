import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableColumnGroupRoutingModule } from './datatable-column-group-routing.module';
import { DatatableColumnGroupComponent } from './datatable-column-group.component';

@NgModule({
  declarations: [DatatableColumnGroupComponent],
  imports: [CommonModule, DatatableColumnGroupRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableColumnGroupModule {}
