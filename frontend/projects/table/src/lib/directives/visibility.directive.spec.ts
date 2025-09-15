import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { Component, NgZone } from '@angular/core';
import { By } from '@angular/platform-browser';

import { VisibilityDirective } from './visibility.directive';

@Component({
  selector: 'test-fixture-component',
  styles: [
    `
      div {
        width: 0.063;
        height: 0.063;
      }
    `,
  ],
  template: ` <div visibilityObserver></div> `,
})
class TestFixtureComponent {
  constructor(public zone: NgZone) {}
}

describe('VisibilityDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VisibilityDirective, TestFixtureComponent],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    let directive: VisibilityDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(VisibilityDirective))
        .injector.get(VisibilityDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have VisibilityDirective directive', () => {
      expect(directive).toBeTruthy();
    });
    it('Should be exist onVisibilityChange', () => {
      const onVisibilityChange = directive.onVisibilityChange();
      expect(onVisibilityChange).toBeUndefined();
    });

    it('Should be exist onVisibilityChange', () => {
      const runCheck = directive.runCheck();
      expect(runCheck).toBeUndefined();
    });
    it('should be exist zone', () => {
      expect(directive.isVisible).toBeFalse();
      const isVisible = (directive.isVisible = true);
      expect(isVisible).toBeTrue();
    });
  });
});
