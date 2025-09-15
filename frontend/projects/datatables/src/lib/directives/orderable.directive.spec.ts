import { Component, ElementRef, InjectionToken } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DimensionsHelper } from '../services/dimensions-helper.service';
import { id } from '../utils/id';
import { DraggableDirective } from './draggable.directive';
import { OrderableDirective } from './orderable.directive';

@Component({
  selector: 'test-fixture-component',
  template: ` <div orderable></div> `,
})
class TestFixtureComponent {}

describe('OrderableDirective', () => {
  let fixture: ComponentFixture<TestFixtureComponent>;
  let component: TestFixtureComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DimensionsHelper,
        DraggableDirective,
        { provide: ElementRef, useValue: {} },
      ],
      declarations: [OrderableDirective, TestFixtureComponent],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TestFixtureComponent);
      component = fixture.componentInstance;

      /* This is required in order to resolve the `ContentChildren`.
       *  If we don't go through at least on change detection cycle
       *  the `draggables` will be `undefined` and `ngOnDestroy` will
       *  fail.
       */
      fixture.detectChanges();
    });
  }));

  describe('fixture', () => {
    let directive: OrderableDirective;

    beforeEach(() => {
      directive = fixture.debugElement
        .query(By.directive(OrderableDirective))
        .injector.get(OrderableDirective);
    });

    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });

    it('should have OrderableDirective directive', () => {
      expect(directive).toBeTruthy();
    });

    describe('when a draggable is removed', () => {
      function checkAllSubscriptionsForActiveObservers() {
        const subs = directive.draggables.map((d) => {
          expect(d.dragEnd.isStopped).toBe(false);
          expect(d.dragStart.isStopped).toBe(false);

          return {
            dragStart: d.dragStart.observers,
            dragEnd: d.dragEnd.observers,
          };
        });

        subs.forEach((sub) => {
          expect(sub.dragStart.length).toBe(1);
          expect(sub.dragEnd.length).toBe(1);
        });
      }

      function newDraggable() {
        // tslint:disable-next-line: no-object-literal-type-assertion
        const draggable = new DraggableDirective(
          <ElementRef>{},
          new DimensionsHelper(),
        );
        // used for the KeyValueDiffer
        draggable.dragModel = {
          $$id: id(),
        };

        return draggable;
      }

      let draggables: DraggableDirective[];

      beforeEach(() => {
        draggables = [newDraggable(), newDraggable(), newDraggable()];

        directive.draggables.reset(draggables);

        directive.updateSubscriptions();

        checkAllSubscriptionsForActiveObservers();
      });

      it('then dragStart and dragEnd are unsubscribed from the removed draggable', () => {
        const unsubbed = draggables.splice(0, 1)[0];

        expect(unsubbed.dragStart.isStopped).toBe(false);
        expect(unsubbed.dragEnd.isStopped).toBe(false);

        directive.draggables.reset(draggables);

        directive.updateSubscriptions();

        checkAllSubscriptionsForActiveObservers();

        expect(unsubbed.dragStart.isStopped).toBe(true);
        expect(unsubbed.dragEnd.isStopped).toBe(true);
      });
    });
  });
});
