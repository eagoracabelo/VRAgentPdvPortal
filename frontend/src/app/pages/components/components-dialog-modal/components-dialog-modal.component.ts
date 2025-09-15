import { Component } from '@angular/core';
import { VrcDialogModalService } from '@vrsoftbr/vr-components';
import { merge, Observable } from 'rxjs';
import { MarkdownCommon } from '../../../shared/models/markdown.common';

@Component({
  selector: 'vr-components-dialog-modal',
  templateUrl: './components-dialog-modal.component.html',
  styleUrls: ['./components-dialog-modal.component.scss'],
})
export class ComponentsDialogModalComponent extends MarkdownCommon {
  returnDialogModal$!: Observable<unknown>;

  constructor(private readonly _vrcDialogModalService: VrcDialogModalService) {
    super();
  }

  showDialogModal(): void {
    const dialogModalService = this._vrcDialogModalService.showDialogModal({});

    this.returnDialogModal$ = merge(
      dialogModalService.confirm$,
      dialogModalService.cancel$,
    );
  }
}
