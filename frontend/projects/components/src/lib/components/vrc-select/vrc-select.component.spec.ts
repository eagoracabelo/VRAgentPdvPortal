import { OverlayModule, ViewportRuler } from '@angular/cdk/overlay';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EmbeddedViewRef,
  EventEmitter,
  Injectable,
  Pipe,
  PipeTransform,
  TemplateRef,
} from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  FormControlDirective,
  FormGroup,
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
} from '@angular/forms';
import { ETokens } from '../../shared';
import { TranslatorPipeImpl } from '../../shared/classes/translator-pipe';

import { IMaskModule } from 'angular-imask';
import { VrcErrorMsgModule } from '../vrc-error-msg';
import { VrCommonModule } from './../../vr-common.module';
import { ITranslatorEventEmitter } from './interfaces/translator-event-emitter.interface';
import {
  Select2Option,
  Select2UpdateValue,
  Select2Utils,
} from './models/vrc-select-utils';
import { VrcSelectComponent } from './vrc-select.component';
import { VrcSelectModule } from './vrc-select.module';

export function createFakeEvent(
  type: string,
  bubbles = false,
  cancelable = true,
  composed = true,
) {
  return new Event(type, { bubbles, cancelable, composed });
}

export function dispatchEvent<T extends Event>(
  node: Node | Window,
  event: T,
): T {
  node.dispatchEvent(event);
  return event;
}

export function dispatchFakeEvent(
  node: Node | Window,
  type: string,
  bubbles?: boolean,
): Event {
  return dispatchEvent(node, createFakeEvent(type, bubbles));
}

class MockTemplateRef extends TemplateRef<any> {
  elementRef = {} as ElementRef<any>;

  createEmbeddedView(context: any) {
    return {} as EmbeddedViewRef<any>;
  }
}

@Component({
  selector: 'mock-stub',
  template: '',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: MockStubComponent,
      multi: true,
    },
  ],
})
class MockStubComponent implements ControlValueAccessor {
  writeValue(obj: any) {}
  registerOnChange(fn: any) {}
  registerOnTouched(fn: any) {}
  setDisabledState(isDisabled: boolean) {}

  formGroup = new FormGroup({
    test: new FormControl({}),
  });
}

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements PipeTransform {
  get translatorChange(): EventEmitter<ITranslatorEventEmitter> {
    return new EventEmitter<ITranslatorEventEmitter>();
  }
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VrcSelectComponent', () => {
  let component: VrcSelectComponent;
  let fixture: ComponentFixture<VrcSelectComponent>;
  let mockTemplateRef: MockTemplateRef;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [VrCommonModule, VrcErrorMsgModule, OverlayModule, IMaskModule],
      declarations: [VrcSelectComponent, MockStubComponent],
      providers: [
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipe,
        },
      ],
    }).compileComponents();
    mockTemplateRef = new MockTemplateRef();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.option = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
        main: true,
      },
    ];
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe(`${VrcSelectComponent.prototype.markChecked.name}`, () => {
    it('should mark checked when called', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.markChecked(option)).toBeDefined();
    });

    it('should not mark checked when called', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 6,
      };
      expect(component.markChecked(option)).toBeDefined();
    });

    it('should mark checked when received from value', fakeAsync(() => {
      const data = [
        {
          value: 6,
          label: 'Label teste 1',
        },
        {
          value: 7,
          label: 'Label teste 2',
        },
      ];
      component.data = data;
      component.multiple = true;
      const option: Select2Option = {
        label: 'Embalagem',
        value: 6,
        main: true,
      };
      component.value = [option as any];
      fixture.detectChanges();
      component.ngOnInit();
      tick(500);
      expect(component.value).toBeDefined();
    }));

    it('should mark checked 1 when received  from value', fakeAsync(() => {
      const data = [
        {
          value: 6,
          label: 'Label teste 1',
        },
        {
          value: 7,
          label: 'Label teste 2',
        },
      ];
      const option = [
        {
          value: 6,
          main: true,
        },
        {
          value: 7,
          main: true,
        },
      ];
      component.data = data;
      component.multiple = true;
      component.value = option;
      fixture.detectChanges();
      component.ngOnInit();
      tick(500);
      expect(component.value).toBeDefined();
    }));
  });

  describe(`${VrcSelectComponent.prototype.markAsMain.name}`, () => {
    it('should return ok when called', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.markAsMain(option)).toBeUndefined();
    });
  });

  describe(`${VrcSelectComponent.prototype.selectIcon.name}`, () => {
    it("should return 'vr vr-principal' when called", () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.selectIcon(option)).toEqual('vr vr-principal');
    });

    it("should return 'vr vr-principal_preenchido' when called", () => {
      const option: Select2Option = {
        label: 'Embalagem2',
        value: 2,
        main: true,
      };
      expect(component.selectIcon(option)).toEqual(
        'vr vr-principal_preenchido',
      );
    });
  });

  describe(`${VrcSelectComponent.prototype.getOptionStyle.name}`, () => {
    it(`should return 'select2-results__option ' when called`, () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.getOptionStyle(option)).toEqual(
        'select2-results__option ',
      );
    });

    it(`should return 'select2-results__option select2-results__option--highlighted ' when called`, () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.setHoveringValue = 1;
      expect(component.getHoveringValue).toBe(1);
      expect(component.getOptionStyle(option)).toEqual(
        'select2-results__option select2-results__option--highlighted ',
      );
    });
  });

  describe(`${VrcSelectComponent.prototype.hideSearch.name}`, () => {
    it(`should return true when called`, () => {
      expect(component.hideSearch()).toBe(true);
    });
  });

  describe(`${VrcSelectComponent.prototype.getOptionStyleDoubleCheck.name}`, () => {
    it(`should return '' when called`, () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.getOptionStyleDoubleCheck(option)).toEqual('');
    });

    it(`should return 'select2-results__option--highlighted ' when called`, () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.setHoveringValue = 1;
      expect(component.getHoveringValue).toBe(1);
      expect(component.getOptionStyleDoubleCheck(option)).toEqual(
        'select2-results__option--highlighted ',
      );
    });
  });

  describe(`${VrcSelectComponent.prototype.exceededItemsCount.name}`, () => {
    it('should show exceeded amount when option is more then maxVisibleItem called', () => {
      component.maxVisibleItem = 0;
      component.exceededItemsCount();
      expect(component.showExceeded).toBeTrue();
    });

    it('should not show exceeded amount when option is less then maxVisibleItem called', () => {
      component.maxVisibleItem = 0;
      component.option = [];
      component.exceededItemsCount();
      expect(component.showExceeded).toBeFalse();
    });
  });

  describe(`${VrcSelectComponent.prototype.reset.name}`, () => {
    it('should return without validating when called', () => {
      let e: MouseEvent = new MouseEvent('click');
      component.option = null;
      expect(component.reset(e)).toBeUndefined();
    });

    it('should validate only one when called', () => {
      let e: MouseEvent = new MouseEvent('click');
      expect(component.reset(e)).toBeUndefined();
    });

    it('should validate for multiples when called', () => {
      let e: MouseEvent = new MouseEvent('click');
      component.multiple = true;
      expect(component.reset(e)).toBeUndefined();
    });

    it('should FormControlDirective', () => {
      let e: MouseEvent = new MouseEvent('click');
      component.multiple = true;
      component.control = new FormControlDirective(
        [],
        [],
        [MockStubComponent as any],
        null,
      ) as any;

      expect(component.reset(e)).toBeUndefined();
    });

    it('should FormControl', () => {
      let e: MouseEvent = new MouseEvent('click');
      component.multiple = true;
      component.control = new FormControl('test');
      expect(component.reset(e)).toBeUndefined();
    });
  });

  describe(`${VrcSelectComponent.prototype.toggleOpenAndClose.name}`, () => {
    it('should open when called', () => {
      expect(component.toggleOpenAndClose()).toBeUndefined();
    });

    it('should close when called', () => {
      component.isOpen = false;
      expect(component.toggleOpenAndClose()).toBeUndefined();
    });
  });

  it('', () => {
    const option: Select2Option = {
      label: 'Embalagem',
      value: 1,
    };

    component.multiple = true;
    expect(component.select(option)).toBeUndefined();
  });

  describe(`${VrcSelectComponent.prototype.select.name}`, () => {
    it('should select multiple when  called', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };

      component.multiple = true;
      expect(component.select(option)).toBeUndefined();
    });

    it('should option equal to null', () => {
      const option = null;

      expect(component.select(option)).toBeUndefined();
    });

    it('should multiple false and isOpen true', () => {
      const option: Select2Option = {
        value: 1,
        label: 'Embalagem',
        main: true,
      };

      component.multiple = false;
      component.isOpen = true;
      expect(component.select(option)).toBeUndefined();
    });

    it('should index > -1 ', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        main: true,
      };

      const option2: Select2Option = {
        label: 'Produto',
        value: 2,
      };

      component.multiple = true;
      component.select(option2);
      expect(component.select(option)).toBeUndefined();
    });
  });

  describe(`${VrcSelectComponent.prototype.markAsMain.name}`, () => {
    it('should mark option as main when called', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };

      component.option = [
        {
          label: 'Option 1',
          value: 1,
        },
        {
          label: 'Option 2',
          value: 2,
        },
        {
          label: 'Option 3',
          value: 3,
        },
      ];

      const spy = spyOn(component.update, 'emit');

      component.markAsMain(option);

      expect(component.option[0].main).toBe(true);
      expect(component.option[1].main).toBeUndefined();
      expect(component.option[2].main).toBeUndefined();

      expect(spy).toHaveBeenCalledWith({
        component: component,
        value: component.option as unknown as Select2UpdateValue,
        options: component.option as Select2Option[],
      });
    });

    it('should mark option as main and click if option not found', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 3,
      };

      component.option = [
        {
          label: 'Option 1',
          value: 1,
          main: true,
        },
        {
          label: 'Option 2',
          value: 2,
          main: false,
        },
        {
          label: 'Option 3',
          value: 2,
          main: false,
        },
      ];

      spyOn(component, 'click');
      const spy = spyOn(component.update, 'emit');

      component.markAsMain(option);

      expect(component.click).toHaveBeenCalledWith(option);

      expect(component.option[0].main).toBe(true);
      expect(component.option[1].main).toBe(false);
      expect(component.option[2].main).toBe(false);

      expect(spy).toHaveBeenCalledWith({
        component: component,
        value: component.option as unknown as Select2UpdateValue,
        options: component.option as Select2Option[],
      });
    });
  });

  describe(`${VrcSelectComponent.prototype.removeSelection.name}`, () => {
    it('should remove selection and update filtered data when multiple and hideSelectedItems are true', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [option];
      component.multiple = true;
      component.hideSelectedItems = true;
      component.data = [option];

      const spy = spyOn(component.update, 'emit');
      spyOn(Select2Utils, 'removeSelection').and.callThrough();

      component.removeSelection(new MouseEvent('click'), option);

      expect(spy).toHaveBeenCalled();
    });

    it('should update value and emit update event when _control is truthy', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [option];
      component.data = [option];
      (component as any)._control = true;

      const spy = spyOn(component.update, 'emit');

      component.removeSelection(new MouseEvent('click'), option);

      expect(spy).toHaveBeenCalled();
    });

    it('should update _value and emit update event when _control is falsy', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [option];
      (component as any)._control = false;

      const spy = spyOn(component.update, 'emit');

      component.removeSelection(new MouseEvent('click'), option);

      expect(spy).toHaveBeenCalled();
    });

    it('should prevent default and stop propagation of the event', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      const event = new MouseEvent('click');
      const spy1 = spyOn(event, 'preventDefault');
      spyOn(event, 'stopPropagation');

      component.removeSelection(event, option);

      expect(spy1).toHaveBeenCalled();
      expect(event.stopPropagation).toHaveBeenCalled();
    });

    it('should focus searchbox or results element if isOpen is true', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [option];
      component.isOpen = true;

      const spy = spyOn(component as any, '_focusSearchboxOrResultsElement');

      component.removeSelection(new MouseEvent('click'), option);

      expect(spy).toHaveBeenCalled();
    });

    it('should call exceededItemsCount', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [option];

      spyOn(component, 'exceededItemsCount');

      component.removeSelection(new MouseEvent('click'), option);

      expect(component.exceededItemsCount).toHaveBeenCalled();
    });
  });

  describe(`${VrcSelectComponent.prototype.setIsDisabled.name}`, () => {
    it('should return true when option is disabled', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        disabled: true,
      };
      expect(component.setIsDisabled(option)).toBe(true);
    });

    it('should return false when option is not disabled', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        disabled: false,
      };
      expect(component.setIsDisabled(option)).toBe(false);
    });
  });

  describe(`${VrcSelectComponent.prototype.isSelected.name}`, () => {
    it('should return "selected" when option is false', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [option];
      component.multiple = false;
      expect(component.isSelected(option)).toEqual('false');
    });

    it('should return "selected" when option is true in multiple mode', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [option];
      component.multiple = true;
      expect(component.isSelected(option)).toEqual('true');
    });

    it('should return "false" when option is not selected', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [];
      component.multiple = false;
      expect(component.isSelected(option)).toEqual('false');
    });

    it('should return "false" when option is not selected in multiple mode', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      component.option = [];
      component.multiple = true;
      expect(component.isSelected(option)).toEqual('false');
    });
  });

  describe(`${VrcSelectComponent.prototype.searchUpdate.name}`, () => {
    it('should update searchText and call updateFilteredData', () => {
      const event = {
        target: {
          value: 'search text',
        } as HTMLInputElement,
      } as any as Event;

      const spy = spyOn(component as any, 'updateFilteredData');

      component.searchUpdate(event);

      expect(component.searchText).toEqual('search text');
      expect(spy).toHaveBeenCalled();
    });

    it('should update searchText and updateFilteredData', fakeAsync(() => {
      const event = {
        target: {
          value: 'search text',
        } as HTMLInputElement,
      } as any as Event;
      component.data = [
        {
          value: 1,
          label: 'Embalagem',
        },
        {
          value: 2,
          label: 'Embalagem2',
        },
        {
          value: 3,
          label: 'Embalagem3',
        },
      ];

      component.searchUpdate(event);
      tick(10);
      expect(component.searchText).toEqual('search text');
    }));
  });

  describe(`${VrcSelectComponent.prototype.openKey.name}`, () => {
    it('should toggle open and close when ArrowDown key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown' });
      const spy = spyOn(component, 'toggleOpenAndClose');
      component.openKey(event);
      expect(spy).toHaveBeenCalled();
      expect(event.defaultPrevented).toBeFalse();
    });

    it('should toggle open and close when ArrowUp key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp' });
      const spy = spyOn(component, 'toggleOpenAndClose');
      component.openKey(event);
      expect(spy).toHaveBeenCalled();
      expect(event.defaultPrevented).toBeFalse();
    });

    it('should toggle open and close when Enter key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const spy = spyOn(component, 'toggleOpenAndClose');
      component.openKey(event);
      expect(spy).toHaveBeenCalled();
      expect(event.defaultPrevented).toBeFalse();
    });

    it('should not toggle open and close when key code 40 is pressed', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 40 });
      const spy = spyOn(component, 'toggleOpenAndClose');
      component.openKey(event);
      expect(spy).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBeFalse();
    });

    it('should not toggle open and close when key code 38 is pressed', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 38 });
      const spy = spyOn(component, 'toggleOpenAndClose');
      component.openKey(event);
      expect(spy).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBeFalse();
    });

    it('should not toggle open and close when key code 13 is pressed', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 13 });
      const spy = spyOn(component, 'toggleOpenAndClose');
      component.openKey(event);
      expect(spy).not.toHaveBeenCalled();
      expect(event.defaultPrevented).toBeFalse();
    });

    it('should focus out and call onTouched when Escape key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      const spy = spyOn(component as any, '_focus');
      const spy2 = spyOn(component, 'onTouched');
      component.openKey(event);
      expect(spy).toHaveBeenCalledWith(false);
      expect(spy2).toHaveBeenCalled();
    });

    it('should focus out and call onTouched when Tab key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Tab' });
      const spy = spyOn(component as any, '_focus');
      const spy2 = spyOn(component, 'onTouched');
      component.openKey(event);
      expect(spy).toHaveBeenCalledWith(false);
      expect(spy2).toHaveBeenCalled();
    });

    it('should not focus out and call onTouched when key code 9 is pressed', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 9 });
      const spy = spyOn(component as any, '_focus');
      const spy2 = spyOn(component, 'onTouched');
      component.openKey(event);
      expect(spy).not.toHaveBeenCalledWith(false);
      expect(spy2).not.toHaveBeenCalled();
    });

    it('should not focus out and call onTouched when key code 27 is pressed', () => {
      const event = new KeyboardEvent('keydown', { keyCode: 27 });
      const spy = spyOn(component as any, '_focus');
      const spy2 = spyOn(component, 'onTouched');
      component.openKey(event);
      expect(spy).not.toHaveBeenCalledWith(false);
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe(`${VrcSelectComponent.prototype.keyDown.name}`, () => {
    it('should move down and prevent default when ArrowDown key is pressed', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowDown',
        keyCode: 40,
      });
      const spy1 = spyOn(event, 'preventDefault');
      const spy = spyOn(component as any, 'moveDown');
      component.keyDown(event);
      expect(spy1).toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
    });

    it('should move up and prevent default when ArrowUp key is pressed', () => {
      const event = new KeyboardEvent('keydown', {
        key: 'ArrowUp',
        keyCode: 38,
      });
      const spy1 = spyOn(event, 'preventDefault');
      const spy2 = spyOn(component as any, 'moveUp');
      component.keyDown(event);
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
    });

    it('should select by enter and prevent default when Enter key is pressed', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13 });
      const spy1 = spyOn(event, 'preventDefault');
      const spy3 = spyOn(component as any, 'selectByEnter');
      component.keyDown(event);
      expect(spy1).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
    });

    it('should toggle open and close, and focus when Escape key is pressed and the component is open', () => {
      component.isOpen = true;
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        keyCode: 27,
      });
      const spy1 = spyOn(event, 'preventDefault');
      const spy = spyOn(component, 'toggleOpenAndClose');
      const spy2 = spyOn(component as any, '_focus');
      component.keyDown(event);
      expect(spy1).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(false);
    });

    it('should toggle open and close, and focus when Tab key is pressed and the component is open', () => {
      component.isOpen = true;
      const event = new KeyboardEvent('keydown', { key: 'Tab', keyCode: 9 });
      const spy1 = spyOn(event, 'preventDefault');
      const spy = spyOn(component, 'toggleOpenAndClose');
      const spy2 = spyOn(component as any, '_focus');
      component.keyDown(event);
      expect(spy1).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(false);
    });

    it('should toggle open and close, and focus when Escape key is pressed and the component is open', () => {
      component.isOpen = true;
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        keyCode: 27,
      });
      const spy1 = spyOn(event, 'preventDefault');
      const spy = spyOn(component, 'toggleOpenAndClose');
      const spy2 = spyOn(component as any, '_focus');
      component.keyDown(event);
      expect(spy1).not.toHaveBeenCalled();
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(false);
    });

    it('should not toggle open and close, and focus when Escape key is pressed and the component is closed', () => {
      component.isOpen = false;
      const event = new KeyboardEvent('keydown', {
        key: 'Escape',
        keyCode: 27,
      });
      const spy1 = spyOn(event, 'preventDefault');
      const spy = spyOn(component, 'toggleOpenAndClose');
      const spy2 = spyOn(component as any, '_focus');
      component.keyDown(event);
      expect(spy1).not.toHaveBeenCalled();
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe(`${VrcSelectComponent.prototype.select.name}`, () => {
    it('should select multiple when called', () => {
      const option: Select2Option = {
        label: 'Embalagem1',
        value: 1,
      };
      const spy = spyOn(component as any, 'updateFilteredData');
      const spy2 = spyOn(component as any, 'onChange');
      const spy3 = spyOn(component.update, 'emit');

      component.multiple = true;
      component.hideSelectedItems = true;
      (component as any)._control = 'NgControl';
      component.select(option);

      expect(component.option).toEqual([
        {
          label: 'Embalagem2',
          value: 2,
          main: true,
        },
      ]);
      expect(component.isOpen).toBeFalse();
      expect((component as any)._value).toBeUndefined();
      expect(spy).toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalledWith([option.value]);
      expect(spy3).toHaveBeenCalled();
    });

    it('should set option to null when called with null', () => {
      const option = null;

      const spy = spyOn(component as any, 'updateFilteredData');
      const spy2 = spyOn(component as any, 'onChange');
      const spy3 = spyOn(component.update, 'emit');

      component.select(option);

      expect(component.option).toBeNull();
      expect((component as any)._value).toBeUndefined();
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
    });

    it('should select single option when called with single option', () => {
      const option: Select2Option = {
        value: 1,
        label: 'Embalagem',
        main: true,
      };

      const spy = spyOn(component as any, 'updateFilteredData');
      const spy2 = spyOn(component as any, 'onChange');
      const spy3 = spyOn(component.update, 'emit');

      component.multiple = false;
      component.isOpen = true;
      component.select(option);

      expect(component.option).toEqual(option);
      expect(component.isOpen).toBeFalse();
      expect((component as any)._value).toEqual(option.value);
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalledWith(option.value);
      expect(spy3).toHaveBeenCalledWith({
        component: component,
        value: option.value,
        options: [option],
      });
    });
  });

  describe(`${VrcSelectComponent.prototype.focusout.name}`, () => {
    it('should call _focus and onTouched when selectionElement does not have "select2-focused" class', () => {
      // Arrange
      (component as any).selectionElement = document.createElement('div');
      const spy = spyOn(component as any, '_focus');
      const spy2 = spyOn(component, 'onTouched');

      // Act
      component.focusout();

      // Assert
      expect(spy).toHaveBeenCalledWith(false);
      expect(spy2).toHaveBeenCalled();
    });

    it('should not call _focus and onTouched when selectionElement has "select2-focused" class', () => {
      // Arrange
      const selectionElement = document.createElement('div');
      selectionElement.classList.add('select2-focused');
      (component as any).selectionElement = selectionElement;
      const spy = spyOn(component as any, '_focus');
      const spy2 = spyOn(component, 'onTouched');

      // Act
      component.focusout();

      // Assert
      expect(spy).not.toHaveBeenCalled();
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe(`${VrcSelectComponent.prototype.focusin.name}`, () => {
    it('should not focus when disabled', () => {
      component.isDisabled = true;
      const spy = spyOn(component as any, '_focus');
      component.focusin();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should focus when not disabled', () => {
      component.isDisabled = false;
      const spy = spyOn(component as any, '_focus');
      component.focusin();
      expect(spy).toHaveBeenCalledWith(true);
    });
  });

  describe(`${VrcSelectComponent.prototype.triggerRect.name}`, () => {
    it('should set triggerRect and dropdownRect when dropdown is available', () => {
      const selectionElement = document.createElement('div');
      const dropdownElement = document.createElement('div');
      (component as any).selectionElement = selectionElement;
      (component as any).dropdown = { nativeElement: dropdownElement } as any;

      component.triggerRect();

      expect(component._triggerRect).toEqual(
        selectionElement.getBoundingClientRect(),
      );
      expect(component._dropdownRect).toEqual(
        dropdownElement.getBoundingClientRect(),
      );
    });

    it('should set only triggerRect when dropdown is not available', () => {
      const selectionElement = document.createElement('div');
      (component as any).selectionElement = selectionElement;
      (component as any).dropdown = undefined;

      component.triggerRect();

      expect(component._triggerRect).toEqual(
        selectionElement.getBoundingClientRect(),
      );
      expect(component._dropdownRect).toBeUndefined();
    });
  });

  describe(`${VrcSelectComponent.prototype.getTemplate.name}`, () => {
    it('should return the template when option has templateId', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        templateId: 'template1',
      };

      component.templates = {
        template1: mockTemplateRef,
      };

      expect(component.getTemplate(option, 'default')).toEqual(mockTemplateRef);
    });

    it('should return the template when option not has templateId', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        templateId: 'template1',
      };

      component.templates = {
        default: mockTemplateRef,
      };

      expect(component.getTemplate(option, 'default')).toEqual(mockTemplateRef);
    });

    it('should return the template when option not has templateId and not default', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        templateId: undefined,
      };

      component.templates = mockTemplateRef;

      expect(component.getTemplate(option, 'default')).toEqual(mockTemplateRef);
    });

    it('should return the template when option not has templateId and return undefine', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        templateId: 'template1',
      };

      component.templates = {
        test: mockTemplateRef,
      };

      expect(component.getTemplate(option, 'default')).toBeUndefined();
    });
  });

  describe(`${VrcSelectComponent.prototype.hasTemplate.name}`, () => {
    it('should return true when templates is a TemplateRef', () => {
      component.templates = new MockTemplateRef();
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.hasTemplate(option, 'default')).toBe(true);
    });

    it('should return true when templates[option.templateId] is a TemplateRef', () => {
      const templateRef = new MockTemplateRef();
      component.templates = {
        template1: templateRef,
      };
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        templateId: 'template1',
      };
      expect(component.hasTemplate(option, 'default')).toBe(true);
    });

    it('should return true when templates[default] is a TemplateRef', () => {
      const templateRef = new MockTemplateRef();
      component.templates = {
        default: templateRef,
      };
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.hasTemplate(option, 'default')).toBe(true);
    });

    it('should return null when templates is null', () => {
      component.templates = null as any;
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.hasTemplate(option, 'default')).toBeNull();
    });

    it('should return false when templates[option.templateId] is null', () => {
      component.templates = {
        template1: null as any,
      };
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        templateId: 'template1',
      };
      expect(component.hasTemplate(option, 'default')).toBe(false);
    });

    it('should return false when templates[default] is null', () => {
      component.templates = {
        default: null as any,
      };
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.hasTemplate(option, 'default')).toBe(false);
    });

    it('should return false when templates[option.templateId] is not a TemplateRef', () => {
      component.templates = {
        template1: {} as any,
      };
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        templateId: 'template1',
      };
      expect(component.hasTemplate(option, 'default')).toBe(false);
    });

    it('should return false when templates[default] is not a TemplateRef', () => {
      component.templates = {
        default: {} as any,
      };
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.hasTemplate(option, 'default')).toBe(false);
    });
  });

  describe(`${VrcSelectComponent.prototype.toggleOpenAndClose.name}`, () => {
    it('should open when called', fakeAsync(() => {
      // Arrange
      component.isDisabled = false;
      component.isOpen = false;
      const spy1 = spyOn(component as any, '_focus');
      const spy2 = spyOn(component as any, '_focusSearchboxOrResultsElement');
      const spy3 = spyOn(component as any, 'updateFilteredData');
      const spy4 = spyOn(component as any, 'updateScrollFromOption');
      const spy6 = spyOn((component as any).open, 'emit');

      // Act
      component.toggleOpenAndClose();

      tick(200);
      // Assert
      expect(spy1).toHaveBeenCalled();
      expect(component.isOpen).toBeTrue();
      expect((component as any).innerSearchText).toBe('');
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy4).toHaveBeenCalled();
      expect(spy6).toHaveBeenCalledWith(component);
    }));

    it('should close when called', () => {
      // Arrange
      component.isDisabled = false;
      component.isOpen = true;
      const spy = spyOn(component as any, '_focus');
      const spy1 = spyOn(component, 'onTouched');
      const spy2 = spyOn(component.close, 'emit');

      // Act
      component.toggleOpenAndClose();

      // Assert
      expect(spy).toHaveBeenCalled();
      expect(component.isOpen).toBeFalse();
      expect(spy1).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(component);
    });

    it('should not open when disabled', () => {
      // Arrange
      component.isDisabled = true;
      component.isOpen = false;
      const spy = spyOn(component as any, '_focus');

      // Act
      component.toggleOpenAndClose();

      // Assert
      expect(spy).not.toHaveBeenCalled();
      expect(component.isOpen).toBeFalse();
    });

    it('should open with specified open value', () => {
      // Arrange
      component.isDisabled = false;
      component.isOpen = false;

      const spy1 = spyOn(component as any, '_focus');
      const spy2 = spyOn(component as any, '_focusSearchboxOrResultsElement');
      const spy3 = spyOn(component as any, 'updateFilteredData');
      const spy4 = spyOn(component as any, 'updateScrollFromOption');
      const spy6 = spyOn((component as any).open, 'emit');

      // Act
      component.toggleOpenAndClose(true, true);

      // Assert
      expect(spy1).toHaveBeenCalled();
      expect(component.isOpen).toBeTrue();
      expect((component as any).innerSearchText).toBe('');
      expect(spy3).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy4).not.toHaveBeenCalled();
      expect(spy6).toHaveBeenCalledWith(component);
    });

    it('should open with specified open value and not option', () => {
      // Arrange
      component.isDisabled = false;
      component.isOpen = false;
      component.option = null;

      const spy1 = spyOn(component as any, '_focus');
      const spy2 = spyOn(component as any, '_focusSearchboxOrResultsElement');
      const spy3 = spyOn(component as any, 'updateFilteredData');
      const spy4 = spyOn(component as any, 'updateScrollFromOption');
      const spy6 = spyOn((component as any).open, 'emit');

      // Act
      component.toggleOpenAndClose(true, true);

      // Assert
      expect(spy1).toHaveBeenCalled();
      expect(component.isOpen).toBeTrue();
      expect((component as any).innerSearchText).toBe('');
      expect(spy3).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy4).not.toHaveBeenCalled();
      expect(spy6).toHaveBeenCalledWith(component);
    });

    it('should open with specified open value and if option not array', () => {
      // Arrange
      component.isDisabled = false;
      component.isOpen = false;
      component.option = {} as any;

      const spy1 = spyOn(component as any, '_focus');
      const spy2 = spyOn(component as any, '_focusSearchboxOrResultsElement');
      const spy3 = spyOn(component as any, 'updateFilteredData');
      const spy4 = spyOn(component as any, 'updateScrollFromOption');
      const spy6 = spyOn((component as any).open, 'emit');

      // Act
      component.toggleOpenAndClose(true, true);

      // Assert
      expect(spy1).toHaveBeenCalled();
      expect(component.isOpen).toBeTrue();
      expect((component as any).innerSearchText).toBe('');
      expect(spy3).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(spy4).not.toHaveBeenCalled();
      expect(spy6).toHaveBeenCalledWith(component);
    });

    it('should open and _clickDetectionFc event and body contains class selection', fakeAsync(() => {
      // Arrange
      component.isDisabled = false;
      component.isOpen = false;
      spyOn(component as any, '_focus');
      spyOn(component as any, '_focusSearchboxOrResultsElement');
      spyOn(component as any, 'updateFilteredData');
      spyOn(component as any, 'updateScrollFromOption');
      spyOn((component as any).open, 'emit');

      document.body.classList.add('selection');

      // Act
      component.toggleOpenAndClose();

      tick(200);
      dispatchFakeEvent(window.document.body, 'click');
      tick(100);
      expect(component.isOpen).toBeFalse();
      document.body.classList.remove('selection');
    }));

    it('should open and _clickDetectionFc event', fakeAsync(() => {
      // Arrange
      component.isDisabled = false;
      component.isOpen = false;
      spyOn(component as any, '_focus');
      spyOn(component as any, '_focusSearchboxOrResultsElement');
      spyOn(component as any, 'updateFilteredData');
      spyOn(component as any, 'updateScrollFromOption');
      spyOn((component as any).open, 'emit');

      // Act
      component.toggleOpenAndClose();

      tick(200);
      dispatchFakeEvent(window.document.body, 'click');
      tick(100);
      expect(component.isOpen).toBeFalse();
    }));
  });

  describe(`${VrcSelectComponent.prototype.prevChange.name}`, () => {
    it('should stop event propagation when called', () => {
      const event = new Event('click');
      spyOn(event, 'stopPropagation');
      component.prevChange(event);
      expect(event.stopPropagation).toHaveBeenCalled();
    });
  });

  describe(`${VrcSelectComponent.prototype.click.name}`, () => {
    it('should call select method when testSelection returns true', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      const spy = spyOn(component as any, 'testSelection').and.returnValue(
        true,
      );
      const spy2 = spyOn(component, 'select');

      component.click(option);

      expect(spy).toHaveBeenCalledWith(option);
      expect(spy2).toHaveBeenCalledWith(option);
    });

    it('should not call select method when testSelection returns false', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      const spy = spyOn(component as any, 'testSelection').and.returnValue(
        false,
      );
      const spy2 = spyOn(component, 'select');

      component.click(option);

      expect(spy).toHaveBeenCalledWith(option);
      expect(spy2).not.toHaveBeenCalled();
    });
  });

  describe(`${VrcSelectComponent.prototype.mouseenter.name}`, () => {
    it('should set hoveringValue when option is not disabled', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        disabled: false,
      };
      component.mouseenter(option);
      expect((component as any).hoveringValue).toBe(1);
    });

    it('should not set hoveringValue when option is disabled', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        disabled: true,
      };
      component.mouseenter(option);
      expect((component as any).hoveringValue).toBeUndefined();
    });
  });

  describe(`${VrcSelectComponent.prototype.hideSearch.name}`, () => {
    it(`should return true when displaySearchStatus is 'default' and isSearchboxHidden is true`, () => {
      component.displaySearchStatus = 'default';
      (component as any).isSearchboxHidden = true;
      expect(component.hideSearch()).toBe(true);
    });

    it(`should return true when displaySearchStatus is 'hidden'`, () => {
      component.displaySearchStatus = 'hidden';
      expect(component.hideSearch()).toBe(true);
    });

    it(`should return false when displaySearchStatus is 'default' and isSearchboxHidden is false`, () => {
      component.displaySearchStatus = 'default';
      (component as any).isSearchboxHidden = false;
      expect(component.hideSearch()).toBe(false);
    });

    it(`should return true when displaySearchStatus is not in the displaySearchStatusList`, () => {
      (component as any).displaySearchStatus = 'invalid';
      expect(component.hideSearch()).toBe(true);
    });
  });

  describe(`${VrcSelectComponent.prototype.updateSearchBox.name}`, () => {
    it('should update search box visibility when custom search is enabled', () => {
      component.customSearchEnabled = true;
      component.data = [];
      (component as any)._minCountForSearch = 5;
      (component as any).isSearchboxHidden = true;

      component.updateSearchBox();

      expect((component as any).isSearchboxHidden).toBe(false);
    });

    it('should update search box visibility when custom search is disabled and data count is less than min count for search', () => {
      component.customSearchEnabled = false;
      component.data = [
        {
          value: 1,
          label: 'Embalagem',
        },
        {
          value: 2,
          label: 'Embalagem2',
        },
        {
          value: 3,
          label: 'Embalagem3',
        },
      ];
      (component as any)._minCountForSearch = 5;
      (component as any).isSearchboxHidden = true;

      component.updateSearchBox();

      expect((component as any).isSearchboxHidden).toBe(true);
    });

    it('should update search box visibility when custom search is disabled and data count is equal to min count for search', () => {
      component.customSearchEnabled = false;
      component.data = [
        {
          value: 1,
          label: 'Embalagem',
        },
        {
          value: 2,
          label: 'Embalagem2',
        },
        {
          value: 3,
          label: 'Embalagem3',
        },
        {
          value: 4,
          label: 'Embalagem4',
        },
        {
          value: 5,
          label: 'Embalagem5',
        },
      ];
      (component as any)._minCountForSearch = 5;
      (component as any).isSearchboxHidden = true;

      component.updateSearchBox();

      expect((component as any).isSearchboxHidden).toBe(false);
    });

    it('should update search box visibility when custom search is disabled and data count is greater than min count for search', () => {
      component.customSearchEnabled = false;
      component.data = [
        {
          value: 1,
          label: 'Embalagem',
        },
        {
          value: 2,
          label: 'Embalagem2',
        },
        {
          value: 3,
          label: 'Embalagem3',
        },
        {
          value: 4,
          label: 'Embalagem4',
        },
        {
          value: 5,
          label: 'Embalagem5',
        },
      ];
      (component as any)._minCountForSearch = 5;
      (component as any).isSearchboxHidden = true;

      component.updateSearchBox();

      expect((component as any).isSearchboxHidden).toBe(false);
    });
  });

  describe(`${VrcSelectComponent.prototype.ngDoCheck.name}`, () => {
    it('should update search box', () => {
      spyOn(component, 'updateSearchBox');
      component.ngDoCheck();
      expect(component.updateSearchBox).toHaveBeenCalled();
    });

    it('should perform dirty check on native value', () => {
      const spy = spyOn(component as any, '_dirtyCheckNativeValue');
      component.ngDoCheck();
      expect(spy).toHaveBeenCalled();
    });

    it('should update overlay width if trigger rect width changes', () => {
      (component as any)._triggerRect = { width: 100 };
      component.overlayWidth = 80;
      component.ngDoCheck();
      expect(component.overlayWidth).toBe(100);
    });

    it('should update overlay height if dropdown rect height changes', () => {
      (component as any)._triggerRect = { width: 100 };
      (component as any)._dropdownRect = { height: 200 };
      component.overlayHeight = 0;
      component.listPosition = 'auto';
      component.ngDoCheck();
      expect(component.overlayHeight).toBe(200);
    });

    it('should not update overlay height if dropdown rect height is 100', () => {
      (component as any)._triggerRect = { width: 100 };
      (component as any)._dropdownRect = { height: 0 };
      component.overlayHeight = 100;
      component.listPosition = 'auto';
      component.ngDoCheck();
      expect(component.overlayHeight).toBe(100);
    });

    it('should not update overlay height if list position is not "auto"', () => {
      (component as any)._triggerRect = { width: 100 };
      (component as any)._dropdownRect = { height: 200 };
      component.overlayHeight = 100;
      (component as any).listPosition = 'top';
      component.ngDoCheck();
      expect(component.overlayHeight).toBe(0);
    });
  });

  describe(`${VrcSelectComponent.prototype.ngAfterViewInit.name}`, () => {
    it('should subscribe to positionChange event and update overlay position', fakeAsync(() => {
      const posChange: any = {
        connectionPair: {
          originY: 'top',
          originX: 'start',
          overlayX: 'start',
          overlayY: 'top',
        },
      };
      component.listPosition = 'auto';
      spyOn(
        (component as any).cdkConnectedOverlay.positionChange,
        'subscribe',
      ).and.callThrough();
      spyOn(component, 'triggerRect');
      const spy = spyOn((component as any)._changeDetectorRef, 'detectChanges');

      component.ngAfterViewInit();
      (component as any).cdkConnectedOverlay.positionChange.emit(posChange);

      tick(200);
      expect(
        (component as any).cdkConnectedOverlay.positionChange.subscribe,
      ).toHaveBeenCalled();
      expect(component.triggerRect).toHaveBeenCalled();
      expect((component as any)._overlayPosition).toBe('top');
      expect(spy).toHaveBeenCalled();
    }));

    it('should not update overlay position if listPosition is not "auto"', fakeAsync(() => {
      const posChange: any = {
        connectionPair: {
          originY: 'top',
        },
      };
      (component as any).listPosition = 'bottom';
      spyOn(
        (component as any).cdkConnectedOverlay.positionChange,
        'subscribe',
      ).and.callThrough();
      const spy1 = spyOn(component, 'triggerRect');
      const spy = spyOn((component as any)._changeDetectorRef, 'detectChanges');

      component.ngAfterViewInit();
      (component as any).cdkConnectedOverlay.positionChange.emit(posChange);
      tick(200);

      expect(
        (component as any).cdkConnectedOverlay.positionChange.subscribe,
      ).toHaveBeenCalled();
      expect(spy1).toHaveBeenCalled();
      expect((component as any)._overlayPosition).not.toBe('top');
      expect(spy).not.toHaveBeenCalled();
    }));

    it('should not update overlay position if connectionPair.originY is not defined', () => {
      const posChange: any = {
        connectionPair: {},
      };
      spyOn(
        (component as any).cdkConnectedOverlay.positionChange,
        'subscribe',
      ).and.callThrough();
      spyOn(component, 'triggerRect');
      const spy = spyOn((component as any)._changeDetectorRef, 'detectChanges');

      component.ngAfterViewInit();
      (component as any).cdkConnectedOverlay.positionChange.emit(posChange);

      expect(
        (component as any).cdkConnectedOverlay.positionChange.subscribe,
      ).toHaveBeenCalled();
      expect(component.triggerRect).toHaveBeenCalled();
      expect((component as any)._overlayPosition).not.toBeDefined();
      expect(spy).not.toHaveBeenCalled();
    });

    it('should not update overlay position if _overlayPosition is already the same as connectionPair.originY', () => {
      const posChange: any = {
        connectionPair: {
          originY: 'top',
        },
      };
      (component as any)._overlayPosition = 'top';
      spyOn(
        (component as any).cdkConnectedOverlay.positionChange,
        'subscribe',
      ).and.callThrough();
      spyOn(component, 'triggerRect');
      const spy = spyOn((component as any)._changeDetectorRef, 'detectChanges');

      component.ngAfterViewInit();
      (component as any).cdkConnectedOverlay.positionChange.emit(posChange);

      expect(
        (component as any).cdkConnectedOverlay.positionChange.subscribe,
      ).toHaveBeenCalled();
      expect(component.triggerRect).toHaveBeenCalled();
      expect((component as any)._overlayPosition).toBe('top');
      expect(spy).not.toHaveBeenCalled();
    });

    it('should set selectionElement to the native element of selection', () => {
      spyOn((component as any).selection, 'nativeElement').and.returnValue(
        {} as HTMLElement,
      );
      spyOn(component, 'triggerRect');

      component.ngAfterViewInit();

      expect((component as any).selectionElement).toBeDefined();
    });

    it('should call triggerRect', () => {
      spyOn(component, 'triggerRect');

      component.ngAfterViewInit();

      expect(component.triggerRect).toHaveBeenCalled();
    });
  });

  describe(`select2Options`, () => {
    it('should return select2Options as Select2Option[] when multiple is true', () => {
      component.multiple = true;
      component.option = [
        {
          label: 'Embalagem',
          value: 1,
        },
        {
          label: 'Embalagem2',
          value: 2,
        },
      ];
      expect(component.select2Options).toEqual(component.option);
    });

    it('should return select2Options as null when multiple is false', () => {
      component.multiple = false;
      expect(component.select2Options).toBeNull();
    });
  });

  describe(`select2Option`, () => {
    it('should return null when multiple is true', () => {
      component.multiple = true;
      expect(component.select2Option).toBeNull();
    });

    it('should return the option as Select2Option when multiple is false', () => {
      component.multiple = false;
      component.option = {
        label: 'Embalagem',
        value: 1,
      };
      expect(component.select2Option).toEqual(component.option);
    });
  });

  describe(`searchText`, () => {
    it('should set innerSearchText when customSearchEnabled is false', () => {
      component.customSearchEnabled = false;
      component.searchText = 'test';
      expect((component as any).innerSearchText).toEqual('test');
    });

    it('should emit search event and set innerSearchText when customSearchEnabled is true', () => {
      component.customSearchEnabled = true;
      (component as any)._value = 'value';
      const searchSpy = spyOn(component.search, 'emit');
      component.searchText = 'test';
      expect(searchSpy).toHaveBeenCalledWith({
        component: component,
        value: 'value',
        search: 'test',
      });
      expect((component as any).innerSearchText).toEqual('test');
    });
  });

  describe(`minCountForSearch`, () => {
    it('should return the value of _minCountForSearch', () => {
      component['_minCountForSearch'] = 5;
      expect(component.minCountForSearch).toBe(5);
    });

    it('should return undefined if _minCountForSearch is not set', () => {
      expect(component.minCountForSearch).toBeUndefined();
    });

    it('should update search box when minCountForSearch is set', () => {
      const spy = spyOn(component, 'updateSearchBox');
      component.minCountForSearch = 5;

      expect(component['_minCountForSearch']).toBe(5);
      expect(spy).toHaveBeenCalled();
    });
  });

  describe(`isRequired`, () => {
    it('should set _required to true when value is truthy', () => {
      component.isRequired = true;
      expect(component['_required']).toBe(true);
    });

    it('should set _required to false when value is falsy', () => {
      component.isRequired = false;
      expect(component['_required']).toBe(false);
    });
  });

  describe(`isDisabled`, () => {
    it('should return true when _control is disabled', () => {
      (component as any)._control = { disabled: true };
      expect(component.isDisabled).toBe(true);
    });

    it('should return false when _control is not disabled', () => {
      (component as any)._control = { disabled: false };
      expect(component.isDisabled).toBe(false);
    });

    it('should return true when _disabled is true', () => {
      (component as any)._control = null;
      (component as any)._disabled = true;
      expect(component.isDisabled).toBe(true);
    });

    it('should return false when _disabled is false', () => {
      (component as any)._control = null;
      (component as any)._disabled = false;
      expect(component.isDisabled).toBe(false);
    });
  });

  describe(`isReadOnly`, () => {
    it('should set _readonly to true when value is true', () => {
      component.isReadOnly = true;
      expect(component['_readonly']).toBe(true);
    });

    it('should set _readonly to false when value is false', () => {
      component.isReadOnly = false;
      expect(component['_readonly']).toBe(false);
    });

    it('should set _readonly to true when value is "true"', () => {
      component.isReadOnly = 'true' as any;
      expect(component['_readonly']).toBe(true);
    });

    it('should set _readonly to false when value is "false"', () => {
      component.isReadOnly = 'false' as any;
      expect(component['_readonly']).toBe(false);
    });

    it('should set _readonly to false when value is undefined', () => {
      component.isReadOnly = undefined as any;
      expect(component['_readonly']).toBe(false);
    });

    it('should set _readonly to false when value is null', () => {
      component.isReadOnly = null as any;
      expect(component['_readonly']).toBe(false);
    });

    it('should set _readonly to true when value is 0', () => {
      component.isReadOnly = 0 as any;
      expect(component['_readonly']).toBe(true);
    });

    it('should set _readonly to true when value is "0"', () => {
      component.isReadOnly = '0' as any;
      expect(component['_readonly']).toBe(true);
    });

    it('should return the value of _readonly', () => {
      component['_readonly'] = true;
      expect(component.isReadOnly).toBe(true);
    });
  });

  describe(`tabIndex`, () => {
    it('should set the tabIndex when a value is provided', () => {
      const value = 5;
      component.tabIndex = value;
      expect(component['_tabIndex']).toEqual(value);
    });

    it('should not set the tabIndex when no value is provided', () => {
      const initialValue = component['_tabIndex'];
      (component as any).tabIndex = undefined;
      expect(component['_tabIndex']).toEqual(initialValue);
    });

    it('should return -1 when isDisabled is true', () => {
      component.isDisabled = true;
      expect(component.tabIndex).toBe(-1);
    });

    it('should return the value of _tabIndex when isDisabled is false', () => {
      component.isDisabled = false;
      (component as any)._tabIndex = 5;
      expect(component.tabIndex).toBe(5);
    });
  });

  describe(`select2above`, () => {
    it('should return true when overlay is not defined and listPosition is "above"', () => {
      (component as any).overlay = undefined;
      component.listPosition = 'above';
      expect(component.select2above).toBeTrue();
    });

    it('should call _isAbobeOverlay method when overlay is defined', () => {
      component.overlay = {} as any;
      spyOn(component as any, '_isAbobeOverlay');
      component.select2above;
      expect((component as any)._isAbobeOverlay).toHaveBeenCalled();
    });
  });

  describe(`_positions`, () => {
    it('should return undefined when listPosition is "auto"', () => {
      component.listPosition = 'auto';
      expect(component._positions).toBeUndefined();
    });

    it('should return null when listPosition is not "auto"', () => {
      (component as any).listPosition = 'top';
      expect(component._positions).toBeNull();
    });
  });

  describe(`setError`, () => {
    it('should set error and detect changes', () => {
      const setErrorSpy = spyOn(component as any, 'setError').and.callThrough();
      const detectChangesSpy = spyOn(
        component['_changeDetectorRef'],
        'detectChanges',
      );

      (component as any).setError(true);

      expect(setErrorSpy).toHaveBeenCalledWith(true);
      expect(detectChangesSpy).toHaveBeenCalled();
    });
  });

  describe(`initViewPortRuler`, () => {
    it('should subscribe to viewportRuler change and triggerRect when isOpen is true', fakeAsync(() => {
      const triggerRectSpy = spyOn(component, 'triggerRect');
      component.isOpen = true;

      dispatchFakeEvent(window, 'resize');
      tick(100);
      expect(triggerRectSpy).toHaveBeenCalled();
    }));

    it('should not triggerRect when isOpen is false', fakeAsync(() => {
      const triggerRectSpy = spyOn(component, 'triggerRect');
      component.isOpen = false;

      dispatchFakeEvent(window, 'resize');
      tick(100);
      expect(triggerRectSpy).not.toHaveBeenCalled();
    }));
  });

  describe(`resetStatusError`, () => {
    it('should call updateSearchBox()', () => {
      const spy = spyOn(component, 'updateSearchBox');

      (component as any).resetStatusError();

      expect(spy).toHaveBeenCalled();
    });

    it('should call updateSearchBox() if if has value', fakeAsync(() => {
      const spy = spyOn(component, 'updateSearchBox');
      component.value = { value: 1, label: 'Embalagem' } as any;
      tick(100);
      (component as any).resetStatusError();

      expect(spy).toHaveBeenCalled();
    }));
  });

  describe(`${VrcSelectComponent.prototype.click.name}`, () => {
    it('should call select method when testSelection returns true', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      const spy = spyOn(component, 'select');

      component.click(option);

      expect(spy).toHaveBeenCalledWith(option);
    });

    it('should call select method when testSelection returns true if multiple true', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      const spy = spyOn(component, 'select');
      component.multiple = true;

      component.click(option);

      expect(spy).toHaveBeenCalledWith(option);
    });

    it('should not call select method when testSelection returns true if multiple true and limitSelection 1', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      const spy = spyOn(component, 'select');
      component.multiple = true;
      component.limitSelection = 1;

      component.click(option);

      expect(spy).not.toHaveBeenCalledWith(option);
    });

    it('should not call select method when testSelection returns true if multiple true and limitSelection 1 if array', fakeAsync(() => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
      };
      const spy = spyOn(component, 'select');
      component.multiple = true;
      component.limitSelection = 1;
      component.value = [{ value: 1, label: 'Embalagem' }] as any;
      tick(100);
      component.click(option);

      expect(spy).not.toHaveBeenCalledWith(option);
    }));

    it('should not call select method when testSelection returns false', () => {
      const option: Select2Option = {
        label: 'Embalagem',
        value: 1,
        disabled: true,
      };
      const spy = spyOn(component, 'select');

      component.click(option);

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe(`value`, () => {
    it('should value testValueChange valid', fakeAsync(() => {
      const data = [{ value: 1, label: 'Embalagem' }] as any;
      component.multiple = true;
      component.limitSelection = 1;
      component.value = data;
      tick(100);
      expect(component['_value']).toEqual(data);
    }));

    it('should value testValueChange valid', fakeAsync(() => {
      const data = [{ value: 1, label: 'Embalagem' }] as any;
      const data2 = [{ value: 2, label: 'Embalagem2' }] as any;
      component['_value'] = data2;
      component.multiple = true;
      component.limitSelection = 1;
      component.value = data;
      tick(100);
      expect(component['_value']).toEqual(data);
    }));

    it('should value testValueChange valid', fakeAsync(() => {
      // value1 = this._value
      // value2 = value
      const defaultValue = [{ value: 1, label: 'Embalagem' }] as any;
      const value = [...defaultValue] as any;
      const _value = [...defaultValue] as any;

      component['_value'] = _value;
      component.multiple = true;
      component.limitSelection = 1;
      component.value = value;
      tick(100);
      expect(component['_value']).toEqual(value);
    }));

    it('should value testValueChange not valid', fakeAsync(() => {
      const data = undefined as any;
      component.multiple = true;
      component.limitSelection = 1;
      component.value = data;
      tick(100);
      expect(component['_value']).toBeUndefined();
    }));

    it('should value testValueChange not valid', fakeAsync(() => {
      const data = null as any;
      component.multiple = true;
      component.limitSelection = 1;
      component.value = data;
      tick(100);
      expect(component['_value']).toBeUndefined();
    }));
  });
});

@Injectable()
export class TranslatorServiceTest {
  private _onTranslatorChange: EventEmitter<ITranslatorEventEmitter> =
    new EventEmitter<ITranslatorEventEmitter>();

  get onTranslatorChange(): EventEmitter<ITranslatorEventEmitter> {
    return this._onTranslatorChange;
  }

  emiter(): void {
    this.onTranslatorChange.emit({
      lang: 'pt-BR',
      translations: '',
    });
  }
}

@Injectable()
export class TranslatorPipeTest implements TranslatorPipeImpl {
  constructor(private translate: TranslatorServiceTest) {}

  get translatorChange(): EventEmitter<ITranslatorEventEmitter> {
    return this.translate.onTranslatorChange;
  }
  transform(value: any, ...args: any[]): string {
    return 'Test';
  }
}

describe('VrcSelectComponent - Translator', () => {
  let component: VrcSelectComponent;
  let fixture: ComponentFixture<VrcSelectComponent>;
  let translatorPipe: TranslatorPipeImpl;
  let translatorService: TranslatorServiceTest;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrCommonModule, VrcSelectModule],
      declarations: [VrcSelectComponent],
      providers: [
        TranslatorPipeTest,
        TranslatorPipeImpl,
        TranslatorServiceTest,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcSelectComponent);
    translatorPipe = TestBed.inject(TranslatorPipeTest);
    translatorService = TestBed.inject(TranslatorServiceTest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should translated label and option multi', fakeAsync(() => {
    component.option = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
        main: true,
      },
    ];
    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
        main: true,
      },
    ];
    component.multiple = true;
    fixture.detectChanges();
    component.ngOnInit();
    tick(500);
    expect(component.data[0].label).toEqual('Embalagem');
  }));

  it('should translated label and option multi and not label not translated', fakeAsync(() => {
    spyOn(translatorPipe, 'transform').and.returnValue(undefined as any);

    component.option = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 3,
        main: true,
      },
    ];

    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
        main: true,
      },
    ];
    component.multiple = true;
    fixture.detectChanges();
    component.ngOnInit();
    tick(500);

    expect(component.data[0].label).toEqual('Embalagem');
  }));

  it('should translated label and option multi and not label', fakeAsync(() => {
    component.option = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 3,
        main: true,
      },
    ];

    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
        main: true,
      },
    ];
    component.multiple = true;
    fixture.detectChanges();
    component.ngOnInit();
    tick(500);
    expect(component.data[0].label).toEqual('Embalagem');
  }));

  it('should translated label and option single', fakeAsync(() => {
    component.option = {
      label: 'Embalagem',
      value: 1,
    };

    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
      },
    ];

    fixture.detectChanges();
    component.ngOnInit();
    tick(500);
    expect(component.data[0].label).toEqual('Embalagem');
    expect(component.option.label).toEqual('Embalagem');
  }));

  it('should translated label and option single and not translated', fakeAsync(() => {
    spyOn(translatorPipe, 'transform').and.returnValue(undefined as any);

    component.option = {
      label: 'Embalagem',
      value: 1,
    };

    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
      },
    ];

    fixture.detectChanges();
    component.ngOnInit();
    tick(500);
    expect(component.option.label).toEqual('Embalagem');
  }));

  it('should translated label and option single and not label', fakeAsync(() => {
    component.option = {
      label: 'Embalagem',
      value: 3,
    };

    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
      },
    ];

    fixture.detectChanges();
    component.ngOnInit();
    tick(500);
    expect(component.data[0].label).toEqual('Embalagem');
  }));

  it('should translated label and option single and not option', fakeAsync(() => {
    component.option = null;

    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
      },
    ];

    fixture.detectChanges();
    component.ngOnInit();
    tick(500);
    expect(component.data[0].label).toEqual('Embalagem');
  }));

  it('should not translate if false', fakeAsync(() => {
    component.translate = false;

    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
      },
    ];

    fixture.detectChanges();
    component.ngOnInit();
    tick(500);
    expect(component.data[0].label).toEqual('Embalagem');
  }));

  it('should translate on emit event', fakeAsync(() => {
    component.data = [
      {
        label: 'Embalagem',
        value: 1,
      },
      {
        label: 'Embalagem2',
        value: 2,
      },
    ];

    fixture.detectChanges();
    component.ngOnInit();

    translatorService.emiter();
    tick(500);
    expect(component.data[0].label).toEqual('Embalagem');
  }));

  it('should call externalSearchEvent', () => {
    const spy = spyOn(component.externalSearchEvent$, 'emit');
    component.externalSearch(new MouseEvent('click'));
    expect(spy).toHaveBeenCalled();
  });

  it('empty title', () => {
    component.isDisabled = false;
    expect(component.title).toEqual('');
  });

  it('title', () => {
    component.isDisabled = true;
    component.multiple = true;
    component.option = [{ label: 'Embalagem', value: 1 }];

    expect(component.title).toEqual('Embalagem');
  });
});

describe('VrcSelectComponent - Control', () => {
  let component: VrcSelectComponent;
  let fixture: ComponentFixture<VrcSelectComponent>;

  let formControlSpy: jasmine.SpyObj<NgControl>;
  formControlSpy = jasmine.createSpyObj('NgControl', [
    'value',
    'valueAccessor',
  ]);

  beforeEach(async () => {
    const NG_CONTROL_PROVIDER = {
      provide: NgControl,
      useClass: class extends NgControl {
        control = new FormControl();
        viewToModelUpdate() {}
      },
    };
    await TestBed.configureTestingModule({
      imports: [VrCommonModule, VrcErrorMsgModule, OverlayModule, IMaskModule],
      declarations: [VrcSelectComponent, MockStubComponent],
      providers: [
        ViewportRuler,
        { provide: ControlContainer, useValue: {} },
        ChangeDetectorRef,
        NgForm,
        FormGroupDirective,
        NgControl,
      ],
    })
      .overrideComponent(VrcSelectComponent, {
        add: { providers: [NG_CONTROL_PROVIDER] },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcSelectComponent);
    (fixture.componentInstance as any).ngControl = new FormControl();
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the value accessor for NgControl', () => {
    expect(component['_control'].valueAccessor).toBe(component);
  });

  it('should initialize the _tabIndex property', () => {
    expect(component['_tabIndex']).toBe(0);
  });
});
