import { Component } from '@angular/core';
import { VrcModalService } from '../../../services/vrc-modal.service';

@Component({
  selector: 'vrc-text-editor-link-modal',
  templateUrl: './vrc-text-editor-link-modal.component.html',
  styleUrls: ['./vrc-text-editor-link-modal.component.scss'],
})
export class VrcTextEditorLinkModalComponent {
  title = 'Criar Link';
  confirmText = 'Adicionar';
  cancelText = 'Cancelar';
  vrcInputValue: string = 'http://';

  constructor(private readonly _vrcModalService: VrcModalService) {}

  onConfirm(): void {
    this._vrcModalService.onConfirm(this.vrcInputValue);
  }

  onCancel(): void {
    this._vrcModalService.onCancel(false);
  }

  onClose(): void {
    this._vrcModalService.onClose();
  }
}
