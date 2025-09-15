import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableTreeRoutingModule } from './datatable-tree-routing.module';
import { DatatableTreeComponent } from './datatable-tree.component';

@NgModule({
  declarations: [DatatableTreeComponent],
  imports: [CommonModule, DatatableTreeRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableTreeModule {}
