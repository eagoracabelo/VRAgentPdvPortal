import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormDebugComponent } from './form-debug/form-debug.component';

@NgModule({
  declarations: [FormDebugComponent],
  exports: [FormDebugComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
})
export class ElementsFormModule {}
