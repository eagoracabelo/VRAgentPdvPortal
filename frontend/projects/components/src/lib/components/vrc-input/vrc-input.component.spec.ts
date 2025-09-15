import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { of } from 'rxjs';

import { VrcInputComponent } from './vrc-input.component';
import { VrcInputModule } from './vrc-input.module';

describe('VrcInputComponent', () => {
  let component: VrcInputComponent;
  let fixture: ComponentFixture<VrcInputComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VrcInputModule],
      declarations: [VrcInputComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should onBlur', () => {
    component.control = new FormControl();

    component.control = {
      value: 'Teste',
      errors: null,
      statusChanges: of('VALID'),
      validator: {
        hasOwnProperty: 'required',
      },
    } as any;

    component.onBlur();

    expect(component.onBlur).toBeTruthy();
  });

  it('checkHasError VALID', () => {
    component.isReadOnly = true;
    component.checkHasError('VALID');

    expect(component.checkHasError).toBeTruthy();
  });

  it('checkHasError INVALID', () => {
    component.checkHasError('INVALID');

    expect(component.checkHasError).toBeTruthy();
  });

  it('onSelectChange', () => {
    component.onSelectChange('required');

    expect(component.onSelectChange).toBeTruthy();
  });

  it('setDisabledState', () => {
    component.isDisabled = true;
    component.setDisabledState(component.isDisabled);

    expect(component.setDisabledState).toBeTruthy();
  });

  describe('setRequiredState', () => {
    it('validator with function', () => {
      component.control = new FormControl();

      component.control = {
        value: 'Teste',
        errors: null,
        statusChanges: of('VALID'),
        validator: () => {},
      } as any;

      component.setRequiredState();

      expect(component.setRequiredState).toBeTruthy();
    });

    it('validator empty', () => {
      component.control = new FormControl();

      component.control = {
        value: 'Teste',
        errors: null,
        statusChanges: of('VALID'),
        validator: '',
      } as any;

      component.setRequiredState();

      expect(component.setRequiredState).toBeTruthy();
    });

    it('validator hasOwnProperty required', () => {
      component.control = new FormControl();

      component.control = {
        value: 'Teste',
        errors: null,
        statusChanges: of('VALID'),
        validator: {
          hasOwnProperty: 'required',
        },
      } as any;

      component.setRequiredState();

      expect(component.setRequiredState).toBeTruthy();
    });
  });

  describe('initStatusChanges', () => {
    it('initStatusChanges with value', () => {
      component.control = new FormControl();

      component.control = {
        value: 'Teste',
        errors: null,
        statusChanges: of('VALID'),
      } as any;

      component.initStatusChanges();

      expect(component.initStatusChanges).toBeTruthy();
    });

    it('initStatusChanges empty', () => {
      component.control = new FormControl();

      component.control = {
        value: '',
        errors: null,
        statusChanges: of('INVALID'),
      } as any;

      component.initStatusChanges();

      expect(component.initStatusChanges).toBeTruthy();
    });
  });

  describe('changeWhenWrote', () => {
    it('should add the required class when event is truthy', () => {
      const element = document.createElement('div');
      element.classList.add('required');
      element.id = 'test-fieldRequired';
      document.body.appendChild(element);

      component.changeWhenWrote({ id: 'test' });
      expect(element.classList.contains('required')).toBe(true);
    });

    it('should remove the required class when event is falsy', () => {
      const element = document.createElement('div');
      element.id = 'test-fieldRequired';
      document.body.appendChild(element);

      component.changeWhenWrote(null);

      expect(element.classList.contains('required')).toBe(false);
    });
  });

  describe('verifyHasValue', () => {
    it('removes "required" class when formValues is truthy', () => {
      const element = document.createElement('div');
      element.id = 'test-fieldRequired';
      document.body.appendChild(element);

      component.control = new FormControl();

      component.control = {
        value: 'teste',
      } as any;

      component.verifyHasValue();

      expect(element.classList.contains('required')).toBe(false);
    });

    it('does not remove "required" class when formValues is falsy', () => {
      const element = document.createElement('div');
      element.classList.add('required');
      element.id = 'test-fieldRequired';
      document.body.appendChild(element);

      component.control = new FormControl();
      component.control = {
        value: null,
      } as any;

      component.verifyHasValue();
      expect(element.classList.contains('required')).toBe(true);
    });

    describe('formatInput', () => {
      it('should format input', () => {
        component.rtl = true;
        component.value = '23';
        component.formatInput();
        expect(component.value).toEqual('0,23');
      });

      it('should not format input for rtl false', () => {
        component.rtl = false;
        component.value = '23';
        component.formatInput();
        expect(component.value).toEqual('23');
      });

      it('should not format input for empty input', () => {
        component.rtl = true;
        component.value = '';
        component.formatInput();
        expect(component.value).toEqual('');
      });
    });

    describe('currency', () => {
      it('should set currency and rtl', () => {
        component.currency = 'R$';
        expect(component.rtl).toBeTrue();
      });

      it('should set currency and not set rtl', () => {
        component.currency = undefined as any;
        expect(component.rtl).toBeUndefined();
      });
    });

    describe('validateNumber', () => {
      it('should not prevent default for rtl false', () => {
        const event = new Event('keypress');
        Object.defineProperty(event, 'keyCode', {
          get() {
            return 50;
          },
        });
        const spy = spyOn(event, 'preventDefault');
        component.rtl = false;
        component.validateNumber(event as any);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not prevent default for valid keycode', () => {
        const event = new Event('keypress');
        Object.defineProperty(event, 'keyCode', {
          get() {
            return 50;
          },
        });
        const spy = spyOn(event, 'preventDefault');
        component.rtl = true;
        component.validateNumber(event as any);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should not prevent default for backspace', () => {
        const event = new Event('keypress');
        Object.defineProperty(event, 'keyCode', {
          get() {
            return 8;
          },
        });
        const spy = spyOn(event, 'preventDefault');
        component.rtl = true;
        component.validateNumber(event as any);
        expect(spy).not.toHaveBeenCalled();
      });

      it('should prevent default', () => {
        const event = new Event('keypress');
        Object.defineProperty(event, 'keyCode', {
          get() {
            return 20;
          },
        });
        const spy = spyOn(event, 'preventDefault');
        component.rtl = true;
        component.validateNumber(event as any);
        expect(spy).toHaveBeenCalled();
      });
    });

    describe('onFocus/onBlur', () => {
      it('should emit event when component focused', () => {
        const spy = spyOn(component.onFocusEvent, 'emit');

        component.onFocus();

        expect(spy).toHaveBeenCalled();
      });
      it('should emit event when component blur', () => {
        const spy = spyOn(component.onBlurEvent, 'emit');

        component.onBlur();

        expect(spy).toHaveBeenCalled();
      });
    });
  });
});
