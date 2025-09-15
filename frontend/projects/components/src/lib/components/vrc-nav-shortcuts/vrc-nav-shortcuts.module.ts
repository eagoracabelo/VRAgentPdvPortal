import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { VrCommonModule } from '../../vr-common.module';
import { VrcIconModule } from '../vrc-icon';
import { FormatShortcutDirective } from './modal/directives/format-shortcut.directive';
import { FilterShortcutPipe } from './modal/pipes/filter-shortcut.pipe';
import { ShortcutsModalComponent } from './modal/shortcuts-modal/shortcuts-modal.component';
import { VrcNavShortcutsComponent } from './vrc-nav-shortcuts.component';

@NgModule({
  declarations: [
    VrcNavShortcutsComponent,
    ShortcutsModalComponent,
    FormatShortcutDirective,
    FilterShortcutPipe,
  ],
  exports: [VrcNavShortcutsComponent],
  imports: [CommonModule, VrCommonModule, VrcIconModule, ReactiveFormsModule],
})
export class VrcNavShortcutsModule {}
