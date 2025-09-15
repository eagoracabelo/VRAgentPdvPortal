import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { VrcIconModule, VrcSelectModule } from '@vrsoftbr/vr-components';

import { TranslatorModule } from '../../translator/translator.module';
import { NavMenuComponent } from './nav-menu.component';

const VRComponents = [VrcSelectModule, VrcIconModule];

@NgModule({
  declarations: [NavMenuComponent],
  imports: [
    ...VRComponents,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslatorModule,
  ],
  exports: [NavMenuComponent],
})
export class NavMenuModule {}
