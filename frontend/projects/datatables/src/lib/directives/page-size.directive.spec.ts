import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PageSizeDirective } from './page-size.directive';

@Component({
  selector: 'test-fixture-component',
  template: `
    <select pageSize>
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="30">30</option>
    </select>
  `,
})
class TestFixtureComponent {}

describe('PageSizeDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;
  let inputEl: DebugElement;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PageSizeDirective, TestFixtureComponent],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
      inputEl = fixture.debugElement.query(By.css('select'));
    });
  }));

  describe('fixture', () => {
    let directive: PageSizeDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(PageSizeDirective))
        .injector.get(PageSizeDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have PageSizeDirective directive', () => {
      expect(directive).toBeTruthy();
    });

    describe('checkStorage', () => {
      it('Esperado que a variável storageSelectedValue esteja undefined', () => {
        directive.ngOnInit();

        expect(directive.storageSelectedValue).toBeUndefined();
      });

      it('Esperado que a variável storageSelectedValue deve ser 1', () => {
        directive.storageKeyPageSize = 'test';
        directive.pageSizeOptions = [1, 2, 3];
        spyOn(localStorage, 'getItem').and.returnValue(btoa('1'));
        directive.ngOnInit();

        expect(directive.storageSelectedValue).toBe(1);
      });
    });

    describe('HostListener', () => {
      it('change event to be storageKeyPageSize undefined', () => {
        const event = new Event('change', {
          target: {
            selectedOptions: [{ value: '10' }],
          },
        } as any);

        inputEl.nativeElement.dispatchEvent(event);
        fixture.detectChanges();

        expect(directive.storageKeyPageSize).toBeUndefined();
      });

      it('change event to be equal 10', () => {
        const event = new Event('change', {
          target: {
            selectedOptions: [{ value: '10' }],
          },
        } as any);

        directive.storageKeyPageSize = 'test';
        inputEl.nativeElement.dispatchEvent(event);
        fixture.detectChanges();

        expect(inputEl.nativeElement.value).toBe('10');
      });
    });

    describe('ngAfterViewInit', () => {
      it('should be storageSelectedValue undefined', () => {
        directive.ngAfterViewInit();

        expect(directive.storageSelectedValue).toBeUndefined();
      });

      it('should be selected to 20', () => {
        directive.storageSelectedValue = 20;
        directive.ngAfterViewInit();

        expect(inputEl.nativeElement.value).toBe('20');
      });
    });

    describe('selectedPageSize', () => {
      it('should be selected to 10', () => {
        directive.selectedPageSize = undefined as any;

        expect(inputEl.nativeElement.value).toBe('10');
      });

      it('should be selected to 30', () => {
        directive.selectedPageSize = 30;

        expect(inputEl.nativeElement.value).toBe('30');
      });
    });
  });
});
