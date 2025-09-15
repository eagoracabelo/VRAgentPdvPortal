import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TableRowDetailDirective } from './row-detail.directive';
import { TableRowDetailTemplateDirective } from './row-detail-template.directive';

@Component({
  selector: 'test-fixture-component',
  template: `
    <vrc-table-row-detail id="t1"></vrc-table-row-detail>
    <vrc-table-row-detail id="t2">
      <ng-template vrc-table-row-detail-template></ng-template>
    </vrc-table-row-detail>
  `,
})
class TestFixtureComponent {}

describe('TableRowDetailDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableRowDetailDirective,
        TableRowDetailTemplateDirective,
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
    let directive: TableRowDetailDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(TableRowDetailDirective))
        .injector.get(TableRowDetailDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have at least one TableRowDetailDirective directive', () => {
      expect(directive).toBeTruthy();
    });
  });

  describe('directive #1', () => {
    let directive: TableRowDetailDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.css('#t1'))
        .injector.get(TableRowDetailDirective);
    });

    it('should be found', () => {
      expect(directive).toBeTruthy();
    });

    it('should not have a template', () => {
      fixture.detectChanges();
      expect(directive.template).toBeUndefined();
    });
  });

  describe('directive #2', () => {
    let directive: TableRowDetailDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.css('#t2'))
        .injector.get(TableRowDetailDirective);
    });

    it('should be found', () => {
      expect(directive).toBeTruthy();
    });

    it('should have a template', () => {
      fixture.detectChanges();
      expect(directive.template).toBeDefined();
    });
  });
});
