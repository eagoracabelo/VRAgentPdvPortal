import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { VrcNavbarComponent } from './vrc-navbar.component';

@NgModule({
  declarations: [VrcNavbarComponent],
  exports: [VrcNavbarComponent],
  imports: [CommonModule, RouterModule],
})
export class VrcNavbarModule {}
