import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VrCommonModule } from '../../vr-common.module';
import { VrcIconModule } from '../vrc-icon';
import { VrcInputModule } from '../vrc-input';
import { VrcTextEditorButtonComponent } from './vrc-text-editor-button/vrc-text-editor-button.component';
import { VrcTextEditorLinkModalComponent } from './vrc-text-editor-link-modal/vrc-text-editor-link-modal.component';
import { VrcTextEditorSelectComponent } from './vrc-text-editor-select/vrc-text-editor-select.component';
import { VrcTextEditorToolbarComponent } from './vrc-text-editor-toolbar/vrc-text-editor-toolbar.component';
import { VrcTextEditorComponent } from './vrc-text-editor.component';

@NgModule({
  declarations: [
    VrcTextEditorComponent,
    VrcTextEditorToolbarComponent,
    VrcTextEditorSelectComponent,
    VrcTextEditorButtonComponent,
    VrcTextEditorLinkModalComponent,
  ],
  exports: [VrcTextEditorComponent],
  imports: [
    CommonModule,
    VrCommonModule,
    FormsModule,
    ReactiveFormsModule,
    VrcIconModule,
    VrcInputModule,
  ],
})
export class VrcTextEditorModule {}
