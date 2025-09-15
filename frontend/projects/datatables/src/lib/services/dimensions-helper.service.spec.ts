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

  it('should getHeight when values in (REM) are greater then 0', () => {
    const el = {
      height: 100,
    } as DOMRect;
    const height = service.getHeight(el)(1.25, 1.25);
    expect(height).toEqual(3.75);
  });

  describe('DimensionsHelper', () => {
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
      expect(htmlFontSize).toEqual(16);
    });

    it('should getHTMLFontSize', () => {
      const htmlEl = document.createElement('html');
      const spyGetElementsByTagName = spyOn(
        document,
        'getElementsByTagName',
      ).and.returnValue([htmlEl] as any);
      const spyGetComputedStyle = spyOn(
        window,
        'getComputedStyle',
      ).and.returnValue({ fontSize: '16px' } as any);

      const htmlFontSize = service.getHTMLFontSize();

      expect(spyGetElementsByTagName).toHaveBeenCalled();
      expect(spyGetComputedStyle).toHaveBeenCalled();
      expect(htmlFontSize).toEqual(16);

      const htmlFontSize2 = service.getHTMLFontSize();
      expect(htmlFontSize2).toEqual(16);
    });

    it('should getHTMLFontSize with missing html element', () => {
      const spyGetElementsByTagName = spyOn(
        document,
        'getElementsByTagName',
      ).and.returnValue([] as any);
      const htmlFontSize = service.getHTMLFontSize();

      expect(spyGetElementsByTagName).toHaveBeenCalled();
      expect(htmlFontSize).toEqual(16);
    });
  });

  describe('getToolsHeight', () => {
    it('should getToolsHeight', () => {
      const element = document.createElement('div');

      const height = service.getToolsHeight(element);

      expect(height).toEqual(50);
    });

    it('should getToolsHeight when datatable-tools element is not found', () => {
      const element = document.createElement('div');
      const toolsEl = document.createElement('datatable-tools');
      element.appendChild(toolsEl);

      const height = service.getToolsHeight(element);

      expect(height).toEqual(0);
    });
  });
});
