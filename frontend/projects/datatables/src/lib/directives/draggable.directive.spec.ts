import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';

import { DraggableDirective } from './draggable.directive';
import { DimensionsHelper } from '../services/dimensions-helper.service';

@Component({
  selector: 'test-fixture-component',
  template: ` <div draggable></div> `,
})
class TestFixtureComponent {}

describe('DraggableDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;
  let element: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DraggableDirective, TestFixtureComponent],
      providers: [DimensionsHelper],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  describe('fixture', () => {
    let directive: DraggableDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(DraggableDirective))
        .injector.get(DraggableDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have DraggableDirective directive', () => {
      expect(directive).toBeTruthy();
    });

    describe('mouse event', () => {
      let mouseDown: MouseEvent;

      beforeEach(() => {
        element.classList.add('draggable');
        mouseDown = <MouseEvent>{
          target: element,
          preventDefault: () => {},
        };
      });

      describe('subscription should be destroyed', () => {
        it('when ngOnDestroy is called', () => {
          directive.onMousedown(mouseDown);
          expect(directive.subscription).toBeTruthy();
          directive.ngOnDestroy();
        });

        it('when onMouseup called and dragging', () => {
          directive.onMousedown(mouseDown);
          expect(directive.subscription).toBeTruthy();
          directive.onMouseup(<MouseEvent>{});
        });
      });

      describe('subscription should not be destroyed', () => {
        it('when onMouseup is called and not dragging', () => {
          directive.onMousedown(mouseDown);
          directive.isDragging = false;

          expect(directive.subscription).toBeTruthy();

          directive.onMouseup(<MouseEvent>{});

          expect(directive.subscription).toBeTruthy();
        });
      });

      describe('move', () => {
        it('should do nothing when isDragging is false', () => {
          const spy = spyOn(directive.dragging, 'emit').and.callThrough();

          const mouseEvent = <MouseEvent>{
            target: element,
            preventDefault: () => {},
          };
          directive.move(mouseEvent, { x: 10, y: 20 });

          expect(spy).not.toHaveBeenCalled();
        });

        it('should emit drag event when move is called', () => {
          const spy = spyOn(directive.dragging, 'emit').and.callThrough();

          directive.isDragging = true;
          directive.dragY = false;

          const mouseEvent = <MouseEvent>{
            clientX: 250,
            clientY: 250,
          };

          expect(directive.element.style.left).toEqual('');

          directive.move(mouseEvent, { x: 10, y: 0 });

          expect(directive.element.style.left).toEqual('15rem');
          expect(spy).toHaveBeenCalledWith({
            event: mouseEvent,
            element: directive.element,
            model: directive.dragModel,
          });
        });

        it('should emit drag event when move is called', () => {
          const spy = spyOn(directive.dragging, 'emit').and.callThrough();

          directive.isDragging = true;
          directive.dragX = false;

          const mouseEvent = <MouseEvent>{
            clientX: 250,
            clientY: 250,
          };

          expect(directive.element.style.top).toEqual('');

          directive.move(mouseEvent, { x: 0, y: 10 });

          expect(directive.element.style.top).toEqual('15rem');
          expect(spy).toHaveBeenCalledWith({
            event: mouseEvent,
            element: directive.element,
            model: directive.dragModel,
          });
        });
      });
    });
  });
});
