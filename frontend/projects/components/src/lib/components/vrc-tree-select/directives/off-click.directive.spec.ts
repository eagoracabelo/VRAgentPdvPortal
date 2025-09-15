import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { OffClickDirective } from './off-click.directive';

describe('OffClickDirective', () => {
  let directive!: OffClickDirective;

  beforeEach(() => {
    const platformId = jasmine.createSpyObj('PLATFORM_ID', ['insert'], {
      injector: TestBed,
    });

    directive = new OffClickDirective(platformId);
  });

  it('should create an instance', () => {
    expect(directive).toBeTruthy();
  });

  it('should call addEventListener onInit', fakeAsync(() => {
    const spy = spyOn(document, 'addEventListener').and.callThrough();
    (directive as any).platformId = 'browser';

    tick(1);

    directive.ngOnInit();

    tick(1);

    expect(directive).toBeTruthy();
    expect(spy).toHaveBeenCalled();
  }));

  it('should NOT call addEventListener onInit', fakeAsync(() => {
    const spy = spyOn(document, 'addEventListener').and.callThrough();
    (directive as any).platformId = '';

    tick(1);

    directive.ngOnInit();

    tick(1);

    expect(directive).toBeTruthy();
    expect(spy).not.toHaveBeenCalled();
  }));

  it('should call addEventListener onDestroy', fakeAsync(() => {
    const spy = spyOn(document, 'removeEventListener').and.callThrough();
    (directive as any).platformId = 'browser';
    directive.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  }));

  it('should NOT call addEventListener onDestroy', fakeAsync(() => {
    const spy = spyOn(document, 'removeEventListener').and.callThrough();
    (directive as any).platformId = '';
    directive.ngOnDestroy();
    expect(spy).not.toHaveBeenCalled();
  }));
});
