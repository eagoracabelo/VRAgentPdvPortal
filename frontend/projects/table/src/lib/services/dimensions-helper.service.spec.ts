import { TestBed } from '@angular/core/testing';

import { DimensionsHelper } from './dimensions-helper.service';

describe('DimensionsHelper', () => {
  let service: DimensionsHelper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new DimensionsHelper();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should getDimensions', () => {
    const el = document.createElement('div');
    const dim = service.getDimensions(el);

    expect(dim).toBeDefined();
    expect(typeof dim).toEqual('object');
    expect(dim.bottom).toBeDefined();
    expect(dim.top).toBeDefined();
    expect(dim.width).toBeDefined();
    expect(dim.height).toBeDefined();
    expect(dim.left).toBeDefined();
    expect(dim.right).toBeDefined();
    expect(dim.x).toBeDefined();
    expect(dim.y).toBeDefined();
  });

  it('should getHeight when values are 0', () => {
    const el = document.createElement('div');
    const dim = service.getDimensions(el);
    const height = service.getHeight(dim)(0, 0);
    expect(height).toEqual(0);
  });

  it('should getHeight when values are greater then 0', () => {
    const el = {
      height: 100,
    } as DOMRect;
    const height = service.getHeight(el)(20, 20);
    expect(height).toEqual(60);
  });

  it('should getHTMLFontSize', () => {
    const htmlFontSize = service.getHTMLFontSize();
    expect(htmlFontSize).toEqual(16);
  });

  it('should getHTMLFontSize default value', () => {
    const spy = spyOn(document, 'getElementsByTagName').and.returnValue(
      undefined as unknown as HTMLCollectionOf<Element>,
    );
    const spyComputedStyle = spyOn(
      window,
      'getComputedStyle',
    ).and.callThrough();

    const htmlFontSize = service.getHTMLFontSize();

    expect(spy).toHaveBeenCalled();
    expect(spyComputedStyle).not.toHaveBeenCalled();
    expect(htmlFontSize).toEqual(1);
  });
});
