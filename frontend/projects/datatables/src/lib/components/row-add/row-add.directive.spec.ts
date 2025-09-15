import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DatatableRowAddDirective } from './row-add.directive';
import { DatatableRowAddTemplateDirective } from './row-add-template.directive';

@Component({
  selector: 'test-fixture-component',
  template: `
    <vrc-datatable-row-add id="t1"></vrc-datatable-row-add>
    <vrc-datatable-row-add id="t2">
      <ng-template vrc-datatable-row-add-template></ng-template>
    </vrc-datatable-row-add>
  `,
})
class TestFixtureComponent {}

describe('DatatableRowAddDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        DatatableRowAddDirective,
        DatatableRowAddTemplateDirective,
        TestFixtureComponent,
      ],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    let directive: DatatableRowAddDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(DatatableRowAddDirective))
        .injector.get(DatatableRowAddDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have at least one DatatableRowAddDirective directive', () => {
      expect(directive).toBeTruthy();
    });
  });

  describe('directive #1', () => {
    let directive: DatatableRowAddDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.css('#t1'))
        .injector.get(DatatableRowAddDirective);
    });

    it('should be found', () => {
      expect(directive).toBeTruthy();
    });

    it('should not have a templateAddQuery', () => {
      fixture.detectChanges();
      expect(directive.templateAddQuery).toBeUndefined();
    });
  });

  describe('directive #2', () => {
    let directive: DatatableRowAddDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.css('#t2'))
        .injector.get(DatatableRowAddDirective);
    });

    it('should be found', () => {
      expect(directive).toBeTruthy();
    });

    it('should have a templateAddQuery', () => {
      fixture.detectChanges();
      expect(directive.templateAddQuery).toBeDefined();
    });
  });
});
