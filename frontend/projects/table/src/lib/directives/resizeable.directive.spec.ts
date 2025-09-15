import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DimensionsHelper } from '../services/dimensions-helper.service';
import { ResizeableDirective } from './resizeable.directive';

@Component({
  selector: 'test-fixture-component',
  template: ` <div resizeable></div> `,
})
class TestFixtureComponent {}

describe('ResizeableDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResizeableDirective, TestFixtureComponent],
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
    let directive: ResizeableDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(ResizeableDirective))
        .injector.get(ResizeableDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have ResizeableDirective directive', () => {
      expect(directive).toBeTruthy();
    });

    describe('onMouseDown', () => {
      it('should not call move and OnMouseup when element dont have "resize-handle" class', () => {
        const mouseEvent = <MouseEvent>{
          screenX: 100,
          target: {
            classList: {
              contains: jasmine.createSpy().and.returnValue(false),
            },
          } as unknown,
          stopPropagation: () => {},
        };

        const spyMove = spyOn(directive, 'move').and.callThrough();
        const spyUp = spyOn(directive, 'onMouseup').and.callThrough();

        expect(directive.resizing).toEqual(false);

        directive.onMousedown(mouseEvent);

        expect(directive.resizing).toEqual(false);

        const eventMove = new CustomEvent('mousemove', {} as Event);
        document.dispatchEvent(eventMove);

        const eventUp = new CustomEvent('mouseup', {} as Event);
        document.dispatchEvent(eventUp);

        expect(spyMove).not.toHaveBeenCalled();
        expect(spyUp).not.toHaveBeenCalled();
      });

      it('should call move and OnMouseup with rem values', () => {
        const mouseEvent = <MouseEvent>{
          screenX: 100,
          target: {
            classList: {
              contains: jasmine.createSpy().and.returnValue(true),
            },
          } as unknown,
          stopPropagation: () => {},
        };

        directive.minWidth = 1;
        directive.maxWidth = 5;

        const spyMove = spyOn(directive, 'move').and.callThrough();
        const spyUp = spyOn(directive, 'onMouseup').and.callThrough();

        expect(directive.resizing).toEqual(false);

        directive.onMousedown(mouseEvent);

        expect(directive.resizing).toEqual(true);

        const eventMove = new CustomEvent('mousemove', {
          screenX: 200,
        } as MouseEvent);
        document.dispatchEvent(eventMove);

        const eventUp = new CustomEvent('mouseup', {} as Event);
        document.dispatchEvent(eventUp);

        expect(spyMove).toHaveBeenCalledWith(
          eventMove as unknown as MouseEvent,
          directive.element.clientWidth / 16,
          mouseEvent.screenX / 16,
        );
        expect(spyUp).toHaveBeenCalled();
      });
    });

    describe('move', () => {
      it('should call move calculate rem and attribute to element width', () => {
        const mouseEvent = <MouseEvent>{
          screenX: 100,
        };

        directive.minWidth = 1;
        directive.maxWidth = 15;

        directive.move(mouseEvent, 10, 5);

        const expectedRem = mouseEvent.screenX / 16 - 5 + 10;

        expect(directive.element.style.width).toEqual(`${expectedRem}rem`);
      });
    });
  });
});
