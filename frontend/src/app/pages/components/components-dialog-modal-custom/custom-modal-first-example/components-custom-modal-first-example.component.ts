import { Component } from '@angular/core';
import { VrcModalService } from '@vrsoftbr/vr-components';
import { Observable } from 'rxjs';
import { ComponentsCustomModalSecondExampleComponent } from '../custom-modal-second-example/components-custom-modal-second-example.component';

@Component({
  selector: 'vr-components-custom-modal-first-example',
  templateUrl: './components-custom-modal-first-example.component.html',
  styleUrls: ['./components-custom-modal-first-example.component.scss'],
})
export class ComponentsCustomModalFirstExampleComponent {
  title = 'Custom Modal';
  confirmText = 'Sim';
  confirmAndAddText = 'Sim';
  isOverlayCancel = true;
  vrcInputValue!: string;
  returnModal$!: Observable<unknown>;

  constructor(private readonly _vrcModalService: VrcModalService) {}

  onConfirm(): void {
    this._vrcModalService.onConfirm(this.vrcInputValue);
  }

  onConfirmAndNotClose(): void {
    this._vrcModalService.onConfirmAndNotClose(this.vrcInputValue);
    this.vrcInputValue = '';
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

  openNew(): void {
    const options = {
      title: 'Multiple Modal 3',
      message: '',
      confirmText: 'Selecionar',
      confirmAndAddText: 'Selecionar sem fechar',
      isOverlayCancel: true,
    };

    const dialogModalCuston = this._vrcModalService.onOpen(
      ComponentsCustomModalSecondExampleComponent,
      options,
    );

    this.returnModal$ = dialogModalCuston.confirm$;
  }
}
