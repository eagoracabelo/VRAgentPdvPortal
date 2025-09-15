import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VrcIconModule } from '@vrsoftbr/vr-components';

import { Pipe, PipeTransform } from '@angular/core';
import { ETokens } from '../../../../enums/tokens.enum';
import { TranslatorPipe } from '../../../../pipes/translator.pipe';
import { IFireEventButton } from '../../interfaces/fire-event-button.interface';
import { ToggleColumnComponent } from '../toggle-column/toggle-column.component';
import { EditColumnService } from './../../../../services/edit-column.service';
import { SelectionType } from './../../../../types/selection.type';
import { FireEventSelectedComponent } from './fire-event-selected.component';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipeTest implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('FireEventSelectedComponent', () => {
  let component: FireEventSelectedComponent;
  let fixture: ComponentFixture<FireEventSelectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FireEventSelectedComponent,
        TranslatorPipe,
        ToggleColumnComponent,
      ],
      providers: [
        EditColumnService,
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipeTest,
        },
      ],
      imports: [VrcIconModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FireEventSelectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Inputs', () => {
    it('O Input selelectedCount deve ser 0', () => {
      expect(component.selectedCount).toEqual(0);
    });

    it('O Input fireEventButtons ser vazio', () => {
      expect(component.fireEventButtons).toEqual([]);
    });
  });

  describe('Output', () => {
    it('O output resetSelected deve estar definido', () => {
      expect(component.resetSelected).toBeDefined();
    });
  });

  describe('onResetSelected', () => {
    it('onResetSelected deve estar definido', () => {
      component.onResetSelected();
      expect(component.onResetSelected).toBeDefined();
    });
  });

  describe('fireEvent', () => {
    it('fireEvent deve gerar um evento', () => {
      component.selectionType = SelectionType.checkbox;
      const spy = spyOn(window, 'dispatchEvent');
      const event = new CustomEvent('testEvent', {
        detail: {
          isTestEvent: true,
        },
      });
      component.selectedCount = 1;
      component.fireEvent(event, false);
      expect(spy).toHaveBeenCalled();
    });

    it('fireEvent não deve gerar um evento', () => {
      component.selectionType = SelectionType.checkbox;
      const spy = spyOn(window, 'dispatchEvent');
      const event = new CustomEvent('testEvent', {
        detail: {
          isTestEvent: true,
        },
      });
      component.selectedCount = 0;
      component.fireEvent(event, false);
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('toggleDropdown', () => {
    it('should toggle isOpen property', () => {
      const btn: IFireEventButton = {
        icon: 'icone',
        label: 'teste',
        dropdown: [
          {
            label: 'teste-1',
          },
        ],
      };
      component.fireEventButtons = [btn];
      component.toggleDropdown(btn);
      expect(component.fireEventButtons.length).toEqual(1);
      expect(component.fireEventButtons[0].isOpen).toEqual(true);
    });
  });

  describe('buildInternalProperties', () => {
    it('should build internal properties of fire buttons', () => {
      const btn: IFireEventButton = {
        icon: 'icone',
        label: 'teste',
        dropdown: [
          {
            label: 'teste-1',
          },
        ],
      };
      component.fireEventButtons = [btn];
      component.ngOnInit();
      expect(component.fireEventButtons.length).toEqual(1);
      expect(component.fireEventButtons[0].isOpen).toBeDefined();
    });
  });

  describe('shouldDisableButton', () => {
    it('should return true', () => {
      component.selectionType = SelectionType.checkbox;
      const btn: IFireEventButton = {
        disabled: true,
      } as any;
      component.selectedCount = 0;
      expect(component.shouldDisableButton(btn)).toEqual(true);
    });
    it('should return false', () => {
      component.selectionType = SelectionType.checkbox;
      const btn: IFireEventButton = {
        disabled: false,
      } as any;
      component.selectedCount = 1;
      expect(component.shouldDisableButton(btn)).toEqual(false);
    });
  });
});
