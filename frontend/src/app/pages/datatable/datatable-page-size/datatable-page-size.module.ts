import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatablePageSizeRoutingModule } from './datatable-page-size-routing.module';
import { DatatablePageSizeComponent } from './datatable-page-size.component';

@NgModule({
  declarations: [DatatablePageSizeComponent],
  imports: [CommonModule, DatatablePageSizeRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatablePageSizeModule {}
