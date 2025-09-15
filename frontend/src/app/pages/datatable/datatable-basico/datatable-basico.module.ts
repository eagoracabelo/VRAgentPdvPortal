import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableBasicoRoutingModule } from './datatable-basico-routing.module';
import { DatatableBasicoComponent } from './datatable-basico.component';

@NgModule({
  declarations: [DatatableBasicoComponent],
  imports: [CommonModule, DatatableBasicoRoutingModule, ...commonsImports],
  providers: [TranslatorPipe],
})
export class DatatableBasicoModule {}
