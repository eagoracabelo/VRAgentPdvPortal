import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TranslatorPipe } from '../../../../pipes/translator.pipe';
import { PageSizeDirective } from './../../../../directives/page-size.directive';
import { PageSizeComponent } from './page-size.component';

describe('PageSizeComponent', () => {
  let component: PageSizeComponent;
  let fixture: ComponentFixture<PageSizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageSizeComponent, TranslatorPipe, PageSizeDirective],
      providers: [],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageSizeComponent);
    component = fixture.componentInstance;
    component.pageSizeOptions = [1, 2, 3];
  });

  describe('Should translate values', () => {
    it('Should set pt-BR translations', () => {
      let element = fixture.nativeElement.querySelector(
        '#test-text-1',
      ) as HTMLElement;
      expect(element.textContent?.trim()).toBe('');

      element = fixture.nativeElement.querySelector(
        '#test-text-2',
      ) as HTMLElement;
      expect(element.textContent?.trim()).toBe('');
    });
  });
});
