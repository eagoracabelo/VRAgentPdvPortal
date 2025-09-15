import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { VrcNavThemeChangerComponent } from './vrc-nav-theme-changer.component';

@NgModule({
  declarations: [VrcNavThemeChangerComponent],
  exports: [VrcNavThemeChangerComponent],
  imports: [CommonModule, FormsModule],
})
export class VrcNavThemeChangerModule {}
