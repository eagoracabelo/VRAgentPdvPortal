import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';

import { Modal, VrcModalService } from './vrc-modal.service';

describe('ModalService', () => {
  let service: VrcModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VrcModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('should get modals', () => {
    it('should return undefined if stack is empty', () => {
      expect(service.modal).toEqual(undefined as any);
    });

    it('should return last added modal', () => {
      const fakeComponent = {} as Type<unknown>;
      service.onOpen(fakeComponent, { name: 'First added' });
      service.onOpen(fakeComponent, { name: 'Second added' });

      const expected = new Modal(fakeComponent, { name: 'Second added' });
      expected.emit();
      expect(service.modal).toEqual(expected);
    });
  });

  describe('onOpen', () => {
    it('should open modal', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, { name: 'First added' });

      const subjectSpy = spyOn((service as any)._subjectStatus, 'next');

      const returnedModal = service.onOpen(fakeComponent, {
        name: 'First added',
      });

      expected.emit();

      expect(returnedModal).toEqual(expected);
      expect(service.modal).toEqual(expected);
      expect(subjectSpy).toHaveBeenCalledWith(true);
    });
  });

  describe('onClose', () => {
    it('should close modal', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, { name: 'First added' });

      const subjectSpy = spyOn((service as any)._subjectStatus, 'next');

      const returnedModal = service.onOpen(fakeComponent, {
        name: 'First added',
      });

      expected.emit();
      expect(subjectSpy).toHaveBeenCalledWith(true);
      expect(returnedModal).toEqual(expected);
      expect(service.modal).toEqual(expected);

      returnedModal.close$.pipe(take(1)).subscribe(() => {
        expect('1').toEqual('1');
      });

      service.onClose();

      expect(subjectSpy).toHaveBeenCalledWith(false);
      expect(service.modal).toEqual(undefined as any);
    });

    it('should close two modals removing from the stack', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, { name: 'First added' });
      const expected2 = new Modal(fakeComponent, { name: 'Second added' });

      service.onOpen(fakeComponent, {
        name: 'First added',
      });
      service.onOpen(fakeComponent, {
        name: 'Second added',
      });

      expected.emit();
      expected2.emit();

      expect(service.modal).toEqual(expected2);

      service.onClose();
      expect(service.modal).toEqual(expected);

      service.onClose();
      expect(service.modal).toEqual(undefined as any);
    });
  });

  describe('onConfirm', () => {
    it('should confirm modal', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, { name: 'First added' });

      const returnedModal = service.onOpen(fakeComponent, {
        name: 'First added',
      });
      expected.emit();
      expect(returnedModal).toEqual(expected);
      expect(service.modal).toEqual(expected);

      returnedModal.confirm$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('confirmed');
      });

      service.onConfirm('confirmed');

      expect(service.modal).toEqual(undefined as any);
    });

    it('should confirm two modals', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, {});
      const expected2 = new Modal(fakeComponent, { name: 'second' });

      const returnedModal = service.onOpen(fakeComponent, {});
      const returnedModal2 = service.onOpen(fakeComponent, { name: 'second' });
      expected.emit();
      expected2.emit();
      expect(returnedModal).toEqual(expected);
      expect(returnedModal2).toEqual(expected2);
      expect(service.modal).toEqual(expected2);

      returnedModal2.confirm$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('confirmed2');
      });

      service.onConfirm('confirmed2');
      expect(service.modal).toEqual(expected);

      returnedModal.confirm$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('confirmed');
      });

      service.onConfirm('confirmed');
      expect(service.modal).toEqual(undefined as any);
    });
  });

  describe('onConfirmAndNotClose', () => {
    it('should confirm and not close modal', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, {});

      const returnedModal = service.onOpen(fakeComponent, {});
      expected.emit();
      expect(returnedModal).toEqual(expected);
      expect(service.modal).toEqual(expected);

      returnedModal.confirm$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('confirmed');
      });

      service.onConfirmAndNotClose('confirmed');

      expect(service.modal).toEqual(expected);
    });

    it('should confirm and not close second modal', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, {});
      const expected2 = new Modal(fakeComponent, { name: 'second' });

      const returnedModal = service.onOpen(fakeComponent, {});
      const returnedModal2 = service.onOpen(fakeComponent, { name: 'second' });
      expected.emit();
      expected2.emit();
      expect(returnedModal).toEqual(expected);
      expect(returnedModal2).toEqual(expected2);
      expect(service.modal).toEqual(expected2);

      returnedModal2.confirm$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('confirmed2');
      });

      service.onConfirmAndNotClose('confirmed2');
      expect(service.modal).toEqual(expected2);
    });
  });

  describe('onCancel', () => {
    it('should cancel modal', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, {});

      const returnedModal = service.onOpen(fakeComponent, {});
      expected.emit();
      expect(returnedModal).toEqual(expected);
      expect(service.modal).toEqual(expected);

      returnedModal.cancel$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('cancelled');
      });

      returnedModal.close$.pipe(take(1)).subscribe(() => {
        expect('1').toEqual('1');
      });

      service.onCancel('cancelled');

      expect(service.modal).toEqual(undefined as any);
    });

    it('should confirm and not close second modal', () => {
      const fakeComponent = {} as Type<unknown>;
      const expected = new Modal(fakeComponent, {});
      const expected2 = new Modal(fakeComponent, { name: 'second' });

      const returnedModal = service.onOpen(fakeComponent, {});
      const returnedModal2 = service.onOpen(fakeComponent, { name: 'second' });
      expected.emit();
      expected2.emit();
      expect(returnedModal).toEqual(expected);
      expect(returnedModal2).toEqual(expected2);
      expect(service.modal).toEqual(expected2);

      returnedModal2.cancel$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('cancelled2');
      });

      returnedModal2.close$.pipe(take(1)).subscribe(() => {
        expect('2').toEqual('2');
      });

      service.onCancel('cancelled2');
      expect(service.modal).toEqual(expected);

      returnedModal.cancel$.pipe(take(1)).subscribe((c) => {
        expect(c).toEqual('cancelled');
      });

      returnedModal.close$.pipe(take(1)).subscribe(() => {
        expect('1').toEqual('1');
      });

      service.onCancel('cancelled');
      expect(service.modal).toEqual(undefined as any);
    });
  });
});
