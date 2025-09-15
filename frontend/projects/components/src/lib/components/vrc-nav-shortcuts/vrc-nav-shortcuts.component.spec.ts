import { Pipe, PipeTransform } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { Modal, VrcModalService } from '../../services/vrc-modal.service';

import { VrcNavShortcutsComponent } from './vrc-nav-shortcuts.component';
import { VrcNavShortcutsModule } from './vrc-nav-shortcuts.module';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VrcNavShortcutsComponent', () => {
  let component: VrcNavShortcutsComponent;
  let fixture: ComponentFixture<VrcNavShortcutsComponent>;
  let modalService: VrcModalService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcNavShortcutsModule],
      declarations: [VrcNavShortcutsComponent, TranslatorPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcNavShortcutsComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(VrcModalService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('toggle', () => {
    it('should be isModalOpen false', fakeAsync(() => {
      const mockModal = { close$: of(false) } as Modal<unknown>;
      spyOn(modalService, 'onOpen').and.returnValue(mockModal);

      component.toggle();
      tick(1000);
      expect(component.isModalOpen).toBeFalse();
    }));
  });

  describe('CTRL + /', () => {
    it('should call addEventControlBar as crtl+/ click, modal open', () => {
      component.toggle();
      expect(component.isModalOpen).toBeTrue();
      component.addEventControlBar(
        new KeyboardEvent('keydown', { ctrlKey: true, key: '/' }),
      );

      expect(component.isModalOpen).toBeFalse();
    });

    it('should call addEventControlBar as crtl+/ click, modal not open', () => {
      const mockModal = { close$: of(false) } as Modal<unknown>;
      spyOn(modalService, 'onOpen').and.returnValue(mockModal);

      component.addEventControlBar(
        new KeyboardEvent('keydown', { ctrlKey: true, key: '/' }),
      );

      expect(component.isModalOpen).toBeFalse();
    });
  });
});
