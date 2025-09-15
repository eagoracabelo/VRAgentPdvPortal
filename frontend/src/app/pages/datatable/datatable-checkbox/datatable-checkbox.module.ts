import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableCheckboxRoutingModule } from './datatable-checkbox-routing.module';
import { DatatableCheckboxComponent } from './datatable-checkbox.component';

@NgModule({
  declarations: [DatatableCheckboxComponent],
  imports: [CommonModule, DatatableCheckboxRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableCheckboxModule {}
