import { Component } from '@angular/core';
import { VrcModalService } from '@vrsoftbr/vr-components';

@Component({
  selector: 'vr-components-dialog-modal-custom-exemple',
  templateUrl: './components-dialog-modal-custom-exemple.component.html',
  styleUrls: ['./components-dialog-modal-custom-exemple.component.scss'],
})
export class ComponentsDialogModalCustomExempleComponent {
  title = 'Custom Modal';

  confirmText = 'Sim';
  confirmAndAddText = 'Sim';
  isOverlayCancel = true;

  vrcImputValue!: string;

  numberMask = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '.',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ',',
  };

  constructor(private readonly _vrcModalService: VrcModalService) {}

  onConfirm(): void {
    this._vrcModalService.onConfirm(this.vrcImputValue);
  }

  onConfirmAndNotClose(): void {
    this._vrcModalService.onConfirmAndNotClose(this.vrcImputValue);
    this.vrcImputValue = '';
  }

  onCancel(): void {
    this._vrcModalService.onCancel(false);
  }

  onClose(): void {
    this._vrcModalService.onClose();
  }

  overlayCancel(): void {
    if (this.isOverlayCancel) {
      this.onClose();
    }
  }
}
