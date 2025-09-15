import { Component } from '@angular/core';

import { VrcModalService } from '../../services/vrc-modal.service';

@Component({
  templateUrl: './vrc-dialog-modal.component.html',
  styleUrls: ['./vrc-dialog-modal.component.scss'],
})
export class VrcDialogModalComponent {
  title = 'Atenção';
  message = 'Deseja continuar ?';

  confirm = true;
  confirmText = 'Sim';

  cancel = true;
  cancelText = 'Não';

  isOverlayCancel = false;

  private readonly responseConfirm = true;
  private readonly responseCancel = false;

  constructor(private readonly _vrcModalService: VrcModalService) {}

  onConfirm(): void {
    this._vrcModalService.onConfirm(this.responseConfirm);
  }

  onConfirmAndNotClose(): void {
    this._vrcModalService.onConfirmAndNotClose(this.responseConfirm);
  }

  onCancel(): void {
    this._vrcModalService.onCancel(this.responseCancel);
  }

  onClose(): void {
    this._vrcModalService.onClose();
  }

  overlayCancel(): void {
    if (this.isOverlayCancel) {
      this.onCancel();
    }
  }
}
