import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { VrcModalService } from './../../../../services/vrc-modal.service';

import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';
import { VrcNavShortcutsModule } from '../../vrc-nav-shortcuts.module';
import { ETokens } from './../../../../shared/enums/tokens.enum';
import { ShortcutsModalComponent } from './shortcuts-modal.component';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('ShortcutsModalComponent', () => {
  let component: ShortcutsModalComponent;
  let fixture: ComponentFixture<ShortcutsModalComponent>;
  let modalService: VrcModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcNavShortcutsModule],
      declarations: [ShortcutsModalComponent],
      providers: [
        {
          provide: VrcModalService,
          useValue: {
            options$: of({ data: { rows: [] } }),
            onConfirm: () => of({}),
            onConfirmAndNotClose: () => of({}),
            onCancel: () => of({}),
            onClose: () => of({}),
          },
        },
        {
          provide: ETokens.TRANSLATOR_TOKEN,
          useClass: TranslatorPipe,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShortcutsModalComponent);
    modalService = TestBed.inject(VrcModalService);
    component = fixture.componentInstance;
    component.shortcuts = [
      {
        keys: ['Alt', 'I'],
        label: 'ATALHOS.INCLUIR-NOVO-FORMULARIO',
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('checkChangedFilter', () => {
    it('should be filter set value not empty', fakeAsync(() => {
      component.ngOnInit();
      component.filterControl.setValue('test');

      tick(1000);

      expect(component.filter).toEqual('test');
    }));

    it('should be filter set value empty', fakeAsync(() => {
      component.ngOnInit();
      component.filterControl.setValue('');

      tick(1000);

      expect(component.filter).toEqual('');
    }));

    it('should be filter set value not string', fakeAsync(() => {
      component.ngOnInit();
      component.filterControl.setValue(1);

      tick(1000);

      expect(component.filter).toEqual('');
    }));
  });

  describe('onEscClick', () => {
    it('should call onClose as onEscClick', () => {
      const spy = spyOn(modalService, 'onClose');
      const event = new KeyboardEvent('keydown', {
        key: 'escape',
      });
      document.dispatchEvent(event);
      expect(spy).toHaveBeenCalled();
    });
  });
});
