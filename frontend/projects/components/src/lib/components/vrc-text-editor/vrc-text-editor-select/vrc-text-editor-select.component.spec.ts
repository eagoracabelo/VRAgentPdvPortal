import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { By } from '@angular/platform-browser';
import { VrCommonModule } from '../../../vr-common.module';
import { VrcIconModule } from '../../vrc-icon';

import { TextEditorService } from '../services/vrc-text-editor.service';
import { VrcTextEditorSelectComponent } from './vrc-text-editor-select.component';

describe('VrcTextEditorSelectComponent', () => {
  let component: VrcTextEditorSelectComponent;
  let fixture: ComponentFixture<VrcTextEditorSelectComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [
        VrCommonModule,
        FormsModule,
        ReactiveFormsModule,
        VrcIconModule,
      ],
      declarations: [VrcTextEditorSelectComponent],
      providers: [
        TextEditorService,
        {
          provide: NG_VALUE_ACCESSOR,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VrcTextEditorSelectComponent);
    component = fixture.componentInstance;
    fixture.debugElement.injector.get(NG_VALUE_ACCESSOR);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render options', () => {
    component.selectedOption = component.options[0];
    fixture.detectChanges();

    const options = fixture.debugElement.queryAll(
      By.css('.text-editor-picker-item'),
    );
    expect(options.length).toBe(3);
  });

  describe('selection', () => {
    it('should select first option after initialized', () => {
      component.ngOnInit();
      expect(component.selectedOption).toBe(component.options[0]);
    });

    it('should select option and close after', () => {
      const event = new MouseEvent('click');
      const stopPropagation = spyOn(event, 'stopPropagation');
      const changeEvent = spyOn(component.changeEvent, 'emit').and.callFake(
        () => {},
      );

      component.opened = true;
      component.selectedOption = component.options[1];
      component.optionSelect(component.options[1], event);

      expect(stopPropagation).toHaveBeenCalled();
      expect(changeEvent).toHaveBeenCalledWith(component.options[1].value);
      expect(component.opened).toBe(false);
    });

    it('should select option by click', () => {
      component.selectedOption = component.options[0];
      fixture.detectChanges();

      const options = fixture.debugElement.queryAll(
        By.css('.text-editor-picker-item'),
      );

      const optionSelect = spyOn(component, 'optionSelect');
      options[1].triggerEventHandler('click', {});
      expect(optionSelect).toHaveBeenCalledWith(
        component.options[1],
        {} as MouseEvent,
      );
    });
  });

  describe('set value', () => {
    it('should successfully set value', () => {
      component.selectedOption = component.options[0];

      const option1value = component.options[1].value;
      component.writeValue(option1value);
      expect(component.selectedOption).toBe(component.options[1]);
      expect(component.value).toBe(option1value);
    });

    it('should not set value if value is null, number or unexisting values', () => {
      component.selectedOption = component.options[0];
      component.writeValue(null as any);
      expect(component.selectedOption).toBe(component.options[0]);
      expect(component.value).toBe(component.options[0].value);
    });

    it('should not set value if value is null, number or unexisting values', () => {
      component.selectedOption = component.options[0];
      component.writeValue(123 as any);
      expect(component.selectedOption).toBe(component.options[0]);
      expect(component.value).toBe(component.options[0].value);
    });

    it('should not set value if value is null, number or unexisting values', () => {
      component.selectedOption = component.options[0];
      component.writeValue('h4');
      expect(component.selectedOption).toBe(component.options[0]);
      expect(component.value).toBe(component.options[0].value);
    });
  });

  describe('toggleOpen', () => {
    it('should close if click event is emitted outside component', () => {
      const close = spyOn(component, 'close');
      component.selectedOption = component.options[0];
      component.opened = true;
      fixture.detectChanges();
      component.onClick();
      expect(close).toHaveBeenCalled();
    });

    it('should call toggleOpen when click on button', () => {
      const spy = spyOn(component, 'toggleOpen');
      component.opened = true;
      const button = fixture.debugElement.query(
        By.css('.text-editor-picker-label'),
      );
      button.triggerEventHandler('click', {});
      expect(spy).toHaveBeenCalledWith({} as MouseEvent);
    });

    it('should handle Open event', () => {
      component.opened = true;
      const event = new MouseEvent('click');
      const stopPropagation = spyOn(event, 'stopPropagation');
      component.toggleOpen(event);
      expect(component.opened).toBe(false);
      expect(stopPropagation).toHaveBeenCalled();
    });

    it('should set "opened" to false', () => {
      component.opened = true;
      component.close();
      expect(component.opened).toBeFalse();
    });
  });

  describe('callback methods', () => {
    it('should be registerOnChange', () => {
      const fn: any = (_: unknown) => {};
      component.registerOnChange(fn);
      expect(component.registerOnChange).toBeDefined();
    });

    it('should be registerOnTouched', () => {
      const fn = () => {};
      component.registerOnTouched(fn);
      expect(component.registerOnTouched).toBeDefined();
    });
  });
});
