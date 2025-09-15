import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslatorPipe } from '../../../shared/pipes/translator.pipe';
import { commonsImports } from '../commons-imports';
import { DatatableInputRoutingModule } from './datatable-input-routing.module';
import { DatatableInputComponent } from './datatable-input.component';

@NgModule({
  declarations: [DatatableInputComponent],
  imports: [
    CommonModule,
    DatatableInputRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ...commonsImports,
  ],
  providers: [TranslatorPipe],
})
export class DatatableInputModule {}
