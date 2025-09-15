import { Component } from '@angular/core';
import {
  VrcDialogModalService,
  VrcModalService,
} from '@vrsoftbr/vr-components';
import { Observable } from 'rxjs';

import { MarkdownCommon } from '../../../shared/models/markdown.common';
import { ComponentsCustomModalFirstExampleComponent } from './custom-modal-first-example/components-custom-modal-first-example.component';
import { ComponentsDialogModalCustomExempleComponent } from './dialog-modal-custom-exemple/components-dialog-modal-custom-exemple.component';

@Component({
  selector: 'vr-components-service-modal',
  templateUrl: './components-dialog-modal-custom.component.html',
  styleUrls: ['./components-dialog-modal-custom.component.scss'],
})
export class ComponentsDialogModalCustomComponent extends MarkdownCommon {
  returnModal$!: Observable<unknown>;
  returnMultiModal$!: Observable<unknown>;

  constructor(
    private readonly _vrcDialogModalService: VrcDialogModalService,
    private readonly _vrcModalService: VrcModalService,
  ) {
    super();
  }

  showDialogModalCuston(): void {
    const options = {
      title: 'Custom Modal',
      message: '',
      confirmText: 'Selecionar',
      confirmAndAddText: 'Selecionar sem fechar',
      isOverlayCancel: true,
    };

    const dialogModalCuston = this._vrcModalService.onOpen(
      ComponentsDialogModalCustomExempleComponent,
      options,
    );

    this.returnModal$ = dialogModalCuston.confirm$;
  }

  showDialogMultipleModal(): void {
    const options = {
      title: 'Multiple Modal 1',
      message: '',
      confirmText: 'Selecionar',
      confirmAndAddText: 'Selecionar sem fechar',
      isOverlayCancel: true,
    };

    const dialogModalCuston = this._vrcModalService.onOpen(
      ComponentsCustomModalFirstExampleComponent,
      options,
    );

    this.returnMultiModal$ = dialogModalCuston.confirm$;
  }
}
