import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { VrcModalService } from '../../services/vrc-modal.service';
import { IModalConfig } from './interfaces/modal-config.interface';
import { IShortcut } from './modal/interfaces/shortcut.interface';
import { ShortcutsModalComponent } from './modal/shortcuts-modal/shortcuts-modal.component';

@Component({
  selector: 'vrc-nav-shortcuts',
  templateUrl: './vrc-nav-shortcuts.component.html',
  styleUrls: ['./vrc-nav-shortcuts.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcNavShortcutsComponent implements OnDestroy {
  @Input() shortcuts: IShortcut[] = [];

  protected modalConfig: IModalConfig = {
    component: ShortcutsModalComponent,
    options: {},
  };

  private readonly _subs: Subscription[] = [];
  isModalOpen = false;

  constructor(private readonly _modalService: VrcModalService) {}

  @HostListener('document:keydown.control./', ['$event'])
  addEventControlBar(event: KeyboardEvent): void {
    event.preventDefault();

    if (this.isModalOpen) {
      this.closeModal();
      return;
    }

    this.showModal();
  }

  toggle(): void {
    this.showModal();
  }

  protected closeModal(): void {
    this._modalService.onClose();
  }

  protected showModal(): void {
    this._subs.push(
      this.openModal().subscribe(() => {
        this.isModalOpen = false;
      }),
    );
  }

  protected openModal(): Observable<unknown> {
    this.isModalOpen = true;
    return this._modalService.onOpen(this.modalConfig.component, {
      data: { shortcuts: this.shortcuts },
    }).close$;
  }

  ngOnDestroy(): void {
    this._subs.forEach((sub) => sub.unsubscribe());
  }
}
