import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableTranslationRoutingModule } from './datatable-translation-routing.module';
import { DatatableTranslationComponent } from './datatable-translation.component';

@NgModule({
  declarations: [DatatableTranslationComponent],
  imports: [CommonModule, DatatableTranslationRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableTranslationModule {}
