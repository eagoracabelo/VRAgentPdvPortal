import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { VrcDialogModalComponent } from '../components';
import { Modal, VrcModalService } from './vrc-modal.service';

@Injectable({
  providedIn: 'root',
})
export class VrcDialogModalService {
  constructor(private readonly _vrcModalService: VrcModalService) {}

  get confirm$(): Observable<unknown> {
    return this._vrcModalService?.confirm$;
  }

  get cancel$(): Observable<unknown> {
    return this._vrcModalService?.cancel$;
  }

  showDialogModal(options?: unknown): Modal<VrcDialogModalComponent> {
    return this._vrcModalService.onOpen(VrcDialogModalComponent, options);
  }
}
