import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { VrAutocomplete } from './vr-autocomplete';

class VrAutocompleteTest extends VrAutocomplete {}

describe('VrAutocomplete', () => {
  let component: VrAutocompleteTest;

  const value: any = { value: 'test' };

  const options = [
    {
      text: 'test',
    },
    value,
  ] as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VrAutocomplete, VrAutocompleteTest],
    }).compileComponents();

    component = new VrAutocompleteTest();
    component.options = options;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be options equality', () => {
    component.text = 'teste';
    expect(component.options).toEqual(options);
    expect(component.text).toEqual('teste');
    expect(component.value).toEqual('teste');

    component.text = 'teste';
    expect(component.text).toEqual('teste');
  });

  it('should be match', () => {
    component.text = 'test';
    component.value = 'test';
    component.match('test');

    expect(component.text).toEqual('test');
    expect(component.value).toBeUndefined();

    const opt = [
      Object.assign({}, ...options, {
        text: 'teste',
      }),
    ];

    component.options = opt as any;

    component.match('test');

    expect(component.text).toEqual('teste');
    expect(component.value).toEqual('test');

    component.match({ id: 1 } as any);

    expect(component.text).toEqual('teste');
    expect(component.value).toEqual('test');
  });

  it('should not match (!selectWhenItMatchs)', () => {
    component.text = 'test';
    component.value = 'test';
    component.selectWhenItMatchs = false;
    component.match('test');

    expect(component.text).toEqual('test');

    const opt = [
      Object.assign({}, ...options, {
        text: 'teste',
      }),
    ];

    component.options = opt as any;

    component.match('test');

    expect(component.text).toEqual('test');
  });

  it('should be setOption', () => {
    let opt = Object.assign({}, ...options, {
      text: undefined,
    });

    component.options = opt as any;

    component.setOption(opt);

    expect(component.text).toEqual('test');
    expect(component.value).toEqual('test');

    opt = Object.assign({});

    component.options = opt as any;

    component.setOption(undefined);

    expect(component.text).toBeUndefined();
    expect(component.value).toBeUndefined();
  });

  it('should be isSelected', () => {
    component.isSelected(1);

    expect(component.text).toEqual('test');
    expect(component.value).toEqual('test');
  });

  it('should be onClose', fakeAsync(() => {
    component.onClose();
    tick(200);
    expect(component.value).toBeNull();
  }));
});
