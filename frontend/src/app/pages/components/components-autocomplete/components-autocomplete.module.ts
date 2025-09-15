import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  VrcAutocompleteModule,
  VrcOptionModule,
  VrcTabsModule,
} from '@vrsoftbr/vr-components';
import { MarkdownModule } from 'ngx-markdown';
import { ComponentsAutocompleteRoutingModule } from './components-autocomplete-routing.module';
import { ComponentsAutocompleteComponent } from './components-autocomplete.component';

@NgModule({
  declarations: [ComponentsAutocompleteComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsAutocompleteRoutingModule,
    VrcTabsModule,
    MarkdownModule,
    VrcAutocompleteModule,
    VrcOptionModule,
  ],
})
export class ComponentsAutocompleteModule {}
