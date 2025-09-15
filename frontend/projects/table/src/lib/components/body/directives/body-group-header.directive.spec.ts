import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TableGroupHeaderDirective } from './body-group-header.directive';
import { TableGroupHeaderTemplateDirective } from './body-group-header-template.directive';

@Component({
  selector: 'test-fixture-component',
  template: `
    <vrc-table-group-header id="t1"></vrc-table-group-header>
    <vrc-table-group-header id="t2">
      <ng-template vrc-table-group-header-template></ng-template>
    </vrc-table-group-header>
  `,
})
class TestFixtureComponent {}

describe('TableGroupHeaderDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        TableGroupHeaderDirective,
        TableGroupHeaderTemplateDirective,
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
    let directive: TableGroupHeaderDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(TableGroupHeaderDirective))
        .injector.get(TableGroupHeaderDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have at least one TableGroupHeaderDirective directive', () => {
      expect(directive).toBeTruthy();
    });
  });

  describe('directive #1', () => {
    let directive: TableGroupHeaderDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.css('#t1'))
        .injector.get(TableGroupHeaderDirective);
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
    let directive: TableGroupHeaderDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.css('#t2'))
        .injector.get(TableGroupHeaderDirective);
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
