import { TestBed } from '@angular/core/testing';
import { TablePageScreen } from './table-page-screen.service';

describe('TablePageScreen', () => {
  let service: TablePageScreen;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = new TablePageScreen();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should calc size with correct value', () => {
    const output = service.calcPageSize(['some-row'])(true)(5, 2, undefined);

    expect(output).toBe(3);
  });

  it('should calcRowCount size with correct value', () => {
    let output = service.calcRowCount(['some-row'])(true, 1)([
      { key: 'some-row', value: [1] },
    ])(false, 1);
    expect(output).toBe(1);

    output = service.calcRowCount(['some-row'])(true, 1)([
      {
        key: 'some-row',
        value: [1],
      },
    ])(true, 1);
    expect(output).toBe(1);
  });
});
