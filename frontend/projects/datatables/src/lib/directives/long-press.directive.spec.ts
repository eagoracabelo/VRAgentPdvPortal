import { Component } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DimensionsHelper } from '../services/dimensions-helper.service';
import { LongPressDirective } from './long-press.directive';

@Component({
  selector: 'test-fixture-component',
  template: ` <div long-press></div> `,
})
class TestFixtureComponent {}

describe('LongPressDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LongPressDirective, TestFixtureComponent],
      providers: [DimensionsHelper],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    let directive: LongPressDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(LongPressDirective))
        .injector.get(LongPressDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have LongPressDirective directive', () => {
      expect(directive).toBeTruthy();
    });

    it('should have isLongPress set to false', () => {
      expect(directive.isLongPress).toBeFalsy();
    });

    describe('onMouseDown', () => {
      it('should do nothing when column is not being edited', () => {
        const mouseEvent = <MouseEvent>{
          which: 2,
        };

        directive.isEditColumn = false;

        const spy = spyOn(directive.longPressStart, 'emit').and.callThrough();

        directive.onMouseDown(mouseEvent);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should do nothing when mouse button isn"t left button', () => {
        const mouseEvent = <MouseEvent>{
          which: 2,
        };

        directive.pressModel = {
          checkboxable: false,
          headerCheckboxable: false,
          draggable: true,
        };
        directive.isEditColumn = true;

        const spy = spyOn(directive.longPressStart, 'emit').and.callThrough();

        directive.onMouseDown(mouseEvent);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should do nothing when classlist contains "resize-handle" class', () => {
        const mouseEvent = <MouseEvent>{
          which: 1,
          target: {
            classList: {
              contains: jasmine.createSpy().and.returnValue(true),
            },
          } as unknown,
        };

        directive.pressEnabled = true;
        directive.pressModel = {
          checkboxable: false,
          headerCheckboxable: false,
          draggable: true,
        };
        directive.isEditColumn = true;

        const spy = spyOn(directive.longPressStart, 'emit').and.callThrough();

        directive.onMouseDown(mouseEvent);

        expect(spy).not.toHaveBeenCalled();
      });

      it('should update mouse values with rem', async () => {
        const mouseEvent = <MouseEvent>{
          which: 1,
          clientX: 100,
          clientY: 100,
          target: {
            classList: {
              contains: jasmine.createSpy().and.returnValue(false),
            },
          } as unknown,
        };

        directive.pressEnabled = true;
        directive.pressModel = {
          checkboxable: false,
          headerCheckboxable: false,
          draggable: true,
        };
        directive.isEditColumn = true;

        directive.onMouseDown(mouseEvent);

        const event = new CustomEvent('mouseup', {} as Event);
        document.dispatchEvent(event);

        expect(directive.mouseX).toEqual(6.25);
        expect(directive.mouseY).toEqual(6.25);
      });
    });
  });
});
