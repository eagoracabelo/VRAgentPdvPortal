import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VrCommonModule } from '../../vr-common.module';
import { VrcAutocompleteModule } from '../vrc-autocomplete';
import { VrcIconModule } from '../vrc-icon';
import { VrcOptionModule } from '../vrc-option';
import { VrcNavSearchComponent } from './vrc-nav-search.component';

@NgModule({
  declarations: [VrcNavSearchComponent],
  exports: [VrcNavSearchComponent],
  imports: [
    CommonModule,
    VrCommonModule,
    RouterModule,
    VrcIconModule,
    VrcAutocompleteModule,
    VrcOptionModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class VrcNavSearchModule {}
