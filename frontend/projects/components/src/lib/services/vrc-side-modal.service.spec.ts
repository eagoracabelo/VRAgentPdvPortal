import { TestBed } from '@angular/core/testing';
import { VrcSideModalService } from './vrc-side-modal.service';

describe('VrcSideModalService', () => {
  let service: VrcSideModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VrcSideModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have initial isActive value as false', () => {
    service.isActive.subscribe((isActive) => {
      expect(isActive).toBeFalse();
    });
  });

  it('should update isActive value', () => {
    const newValue = true;
    service.setIsActive(newValue);
    service.isActive.subscribe((isActive) => {
      expect(isActive).toBe(newValue);
    });
  });
});
