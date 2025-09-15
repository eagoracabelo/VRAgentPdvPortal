import { TestBed } from '@angular/core/testing';
import { VrcDialogModalService } from './vrc-dialog-modal.service';

describe('VrcDialogModalService', () => {
  let service: VrcDialogModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
    });
    service = TestBed.inject(VrcDialogModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    const event = new CustomEvent('changetheme', { detail: { theme: 'dark' } });
    document.dispatchEvent(event);
  });
});
