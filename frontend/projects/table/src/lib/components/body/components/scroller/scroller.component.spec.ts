import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { DimensionsHelper } from '../../../../../../src/lib/services/dimensions-helper.service';

import { ScrollerComponent } from './scroller.component';

describe('ScrollerComponent', () => {
  let fixture: ComponentFixture<ScrollerComponent>;
  let component: ScrollerComponent;
  let service: DimensionsHelper;
  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScrollerComponent],
      providers: [DimensionsHelper],
    });
    service = new DimensionsHelper();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ScrollerComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });
  describe('onScrolled', () => {
    it('should be call obejects in onScrolled', () => {
      const mouseEvent = {
        currentTarget: {
          scrollTop: 0,
          scrollLeft: 5,
        },
      } as unknown as MouseEvent;
      const mouseScrolled = component.onScrolled(mouseEvent);

      expect(mouseScrolled).toBeUndefined();
      const htmlFontSize = service.getHTMLFontSize();
      expect(htmlFontSize).toEqual(16);
      expect(component.scrollXPos).toBeDefined();
      expect(component.scrollYPos).toBeDefined();
    });

    it('should access htmlFontSize', () => {
      expect(component.htmlFontSize).toBeUndefined();
      const html = (component.htmlFontSize = service.getHTMLFontSize());

      expect(html).toEqual(16);
    });
    it('Should exist function updateOffset', () => {
      expect(component.updateOffset()).toBeUndefined();
    });
  });
});
