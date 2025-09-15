import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DimensionsHelper } from '../../../../services/dimensions-helper.service';
import { ScrollerComponent } from './scroller.component';

@Injectable()
class FakeDimensionsHelper {
  getHTMLFontSize(): number {
    return 16;
  }
}

describe('ScrollerComponent', () => {
  let fixture: ComponentFixture<ScrollerComponent>;
  let component: ScrollerComponent;
  let service: DimensionsHelper;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrollerComponent],
      providers: [
        {
          provide: DimensionsHelper,
          useClass: FakeDimensionsHelper,
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    service = TestBed.inject(DimensionsHelper);
  });

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('onScrolled', () => {
    it('should update scrollYPos and scrollXPos', fakeAsync(() => {
      const event = {
        currentTarget: {
          scrollTop: 100,
          scrollLeft: 50,
        },
      } as unknown as MouseEvent;

      component.onScrolled(event);
      tick(100);

      expect(component.scrollYPos).toBe(100 / service.getHTMLFontSize());
      expect(component.scrollXPos).toBe(50 / service.getHTMLFontSize());
    }));

    it('should emit scroll event with direction, scrollYPos, and scrollXPos', fakeAsync(() => {
      const event = {
        currentTarget: {
          scrollTop: 100,
          scrollLeft: 50,
        },
      } as unknown as MouseEvent;

      let emittedEvent: any;
      component.scroll.subscribe((event: any) => {
        emittedEvent = event;
      });

      component.onScrolled(event);
      tick(100);

      expect(emittedEvent.direction).toBeDefined();
      expect(emittedEvent.scrollYPos).toBe(100 / service.getHTMLFontSize());
      expect(emittedEvent.scrollXPos).toBe(50 / service.getHTMLFontSize());
    }));
  });

  describe('setOffset', () => {
    it('should set the scrollTop of parentElement to the given offsetY', () => {
      const offsetY = 200;
      component.parentElement = {
        scrollTop: 0,
      };

      component.setOffset(offsetY);

      expect(component.parentElement.scrollTop).toBe(offsetY);
    });
  });

  describe('ngOnDestroy', () => {
    it('should remove the scroll event listener', () => {
      const fixture2 = TestBed.createComponent(ScrollerComponent);
      const component2 = fixture2.componentInstance;
      component2.scrollbarV = true;
      component2.scrollWidth = 100;
      component2.ngOnInit();
      component2.ngOnDestroy();

      expect((component2 as any)._scrollEventListener).toBeNull();
    });
  });

  describe('updateOffset', () => {
    it('should emit scroll event with direction, scrollYPos, and scrollXPos', () => {
      const fixture2 = TestBed.createComponent(ScrollerComponent);
      const component2 = fixture2.componentInstance;
      const direction = 'down';
      const scrollYPos = 100;
      const scrollXPos = 50;

      component2.prevScrollYPos = 150;
      component2.scrollYPos = scrollYPos;
      component2.prevScrollXPos = 25;
      component2.scrollXPos = scrollXPos;

      let emittedEvent: any;
      component2.scroll.subscribe((event: any) => {
        emittedEvent = event;
      });

      component2.updateOffset();

      expect(emittedEvent.direction).toBe(direction);
      expect(emittedEvent.scrollYPos).toBe(scrollYPos);
      expect(emittedEvent.scrollXPos).toBe(scrollXPos);
      expect(component2.prevScrollYPos).toBe(scrollYPos);
      expect(component2.prevScrollXPos).toBe(scrollXPos);
    });

    it('should set direction to "up" when scrollYPos is greater than prevScrollYPos', () => {
      const direction = 'up';
      const scrollYPos = 100;
      const scrollXPos = 50;

      component.prevScrollYPos = 50;
      component.scrollYPos = scrollYPos;
      component.prevScrollXPos = 25;
      component.scrollXPos = scrollXPos;

      let emittedEvent: any;
      component.scroll.subscribe((event: any) => {
        emittedEvent = event;
      });

      component.updateOffset();

      expect(emittedEvent.direction).toBe(direction);
      expect(emittedEvent.scrollYPos).toBe(scrollYPos);
      expect(emittedEvent.scrollXPos).toBe(scrollXPos);
      expect(component.prevScrollYPos).toBe(scrollYPos);
      expect(component.prevScrollXPos).toBe(scrollXPos);
    });

    it('should set direction to "down" when scrollYPos is less than prevScrollYPos', () => {
      const direction = 'down';
      const scrollYPos = 50;
      const scrollXPos = 50;

      component.prevScrollYPos = 100;
      component.scrollYPos = scrollYPos;
      component.prevScrollXPos = 25;
      component.scrollXPos = scrollXPos;

      let emittedEvent: any;
      component.scroll.subscribe((event: any) => {
        emittedEvent = event;
      });

      component.updateOffset();

      expect(emittedEvent.direction).toBe(direction);
      expect(emittedEvent.scrollYPos).toBe(scrollYPos);
      expect(emittedEvent.scrollXPos).toBe(scrollXPos);
      expect(component.prevScrollYPos).toBe(scrollYPos);
      expect(component.prevScrollXPos).toBe(scrollXPos);
    });
  });
});
