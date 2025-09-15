import { KeyValueDiffers } from '@angular/core';
import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { DataTableRowWrapperComponent } from './body-row-wrapper.component';

const mockKeyValueDiffers = {
  diff: (row: any) => true,
  find: (param: any) => ({
    create: () => ({
      diff: (row: any) => true,
    }),
  }),
};

describe('DataTableRowWrapperComponent', () => {
  let fixture: ComponentFixture<DataTableRowWrapperComponent>;
  let component: DataTableRowWrapperComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableRowWrapperComponent],
      providers: [{ provide: KeyValueDiffers, useValue: mockKeyValueDiffers }],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableRowWrapperComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct inputs', () => {
    component.innerWidth = 100;
    component.rowDetail = {};
    component.groupHeader = {};
    component.offsetX = 10;
    component.detailRowHeight = {};
    component.row = {};
    component.groupedRows = {};
    component.rowIndex = 1;
    component.expanded = true;
    component.zindexRowOverNextRow = true;
    component.count = 5;
    component.index = 2;

    expect(component.innerWidth).toBe(100);
    expect(component.rowDetail).toEqual({});
    expect(component.groupHeader).toEqual({});
    expect(component.offsetX).toBe(10);
    expect(component.detailRowHeight).toEqual({});
    expect(component.row).toEqual({});
    expect(component.groupedRows).toEqual({});
    expect(component.rowIndex).toBe(1);
    expect(component.expanded).toBe(true);
    expect(component.zindexRowOverNextRow).toBe(true);
    expect(component.count).toBe(5);
    expect(component.index).toBeUndefined(); // Since index setter does not have a getter
  });

  it('should emit rowContextmenu event on contextmenu', () => {
    const event = new MouseEvent('contextmenu');
    const row = {};

    spyOn(component.rowContextmenu, 'emit');

    component.row = row;
    component.onContextmenu(event);

    expect(component.rowContextmenu.emit).toHaveBeenCalledWith({ event, row });
  });

  it('should update rowContext and groupContext on ngDoCheck', () => {
    const row = {};

    component.row = row;
    component.ngDoCheck();

    expect(component.rowContext.row).toEqual(row);
    expect(component.groupContext.group).toEqual(row);
  });
});
