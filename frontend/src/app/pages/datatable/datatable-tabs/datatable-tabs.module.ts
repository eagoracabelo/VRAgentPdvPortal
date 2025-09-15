import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableTabsRoutingModule } from './datatable-tabs-routing.module';
import { DatatableTabsComponent } from './datatable-tabs.component';

@NgModule({
  declarations: [DatatableTabsComponent],
  imports: [CommonModule, DatatableTabsRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableTabsModule {}
