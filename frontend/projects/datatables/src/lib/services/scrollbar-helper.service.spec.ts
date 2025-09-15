import { DOCUMENT } from '@angular/common';
import { Injector } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DimensionsHelper } from './dimensions-helper.service';
import { ScrollbarHelper } from './scrollbar-helper.service';

describe('ScrollbarHelper', () => {
  let service: ScrollbarHelper;
  let documentMock: any;
  let dimensionsHelperMock: jasmine.SpyObj<DimensionsHelper>;
  let injectorMock: jasmine.SpyObj<Injector>;

  beforeEach(() => {
    documentMock = {
      createElement: jasmine.createSpy('createElement').and.callFake(() => {
        return {
          style: {},
          offsetWidth: 100,
          appendChild: jasmine.createSpy('appendChild'),
          parentNode: { removeChild: jasmine.createSpy('removeChild') },
        };
      }),
      body: {
        appendChild: jasmine.createSpy('appendChild'),
      },
    };

    dimensionsHelperMock = jasmine.createSpyObj('DimensionsHelper', [
      'getHTMLFontSize',
    ]);
    dimensionsHelperMock.getHTMLFontSize.and.returnValue(16);

    injectorMock = jasmine.createSpyObj('Injector', ['get']);
    injectorMock.get.and.returnValue(dimensionsHelperMock);

    TestBed.configureTestingModule({
      providers: [
        ScrollbarHelper,
        { provide: DOCUMENT, useValue: documentMock },
        { provide: Injector, useValue: injectorMock },
      ],
    });

    service = TestBed.inject(ScrollbarHelper);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
