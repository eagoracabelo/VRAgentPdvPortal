import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CodeMirrorComponent } from './code-mirror.component';

@NgModule({
  declarations: [CodeMirrorComponent],
  exports: [CodeMirrorComponent],
  imports: [CommonModule, FormsModule],
})
export class CodeMirrorModule {}
