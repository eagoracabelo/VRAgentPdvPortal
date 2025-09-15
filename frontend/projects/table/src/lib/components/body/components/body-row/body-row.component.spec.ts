import {
  ChangeDetectorRef,
  ElementRef,
  Injectable,
  KeyValueDiffers,
} from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScrollbarHelper } from '../../../../services/scrollbar-helper.service';
import { Keys } from '../../../../utils/keys';
import { TableBodyRowComponent } from './body-row.component';

@Injectable()
export class ScrollbarHelperMock {}

describe('TableBodyRowComponent', () => {
  let component: TableBodyRowComponent;
  let fixture: ComponentFixture<TableBodyRowComponent>;
  let elementRef: ElementRef;

  beforeEach(() => {
    elementRef = new ElementRef(document.createElement('div'));

    TestBed.configureTestingModule({
      declarations: [TableBodyRowComponent],
      providers: [
        { provide: ScrollbarHelper, useValue: ScrollbarHelperMock },
        { provide: ElementRef, useValue: elementRef },
        KeyValueDiffers,
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TableBodyRowComponent);
    component = fixture.componentInstance;
    component._columnGroupWidths = { total: '100rem' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set columns and recalculate columns', () => {
    const columns = [{ name: 'Column 1' }, { name: 'Column 2' }];
    component.columns = columns;
    expect(component.columns).toEqual(columns);
  });

  it('should set innerWidth and recalculate columns', () => {
    const innerWidth = 500;
    component.innerWidth = innerWidth;
    expect(component.innerWidth).toBe(innerWidth);
  });

  it('should set offsetX and build styles by group', () => {
    const offsetX = 100;
    component.offsetX = offsetX;
    expect(component.offsetX).toBe(offsetX);
  });

  it('should emit activate event on keydown', () => {
    const spy = spyOn(component.activate, 'emit');

    const event = new KeyboardEvent('keydown', {
      keyCode: Keys.return,
    });
    // Sobrescrevendo a propriedade target
    Object.defineProperty(event, 'target', {
      value: component._element,
      writable: false,
    });
    component.onKeyDown(event);
    expect(spy).toHaveBeenCalled();
  });

  it('should emit activate event on mouseenter', () => {
    spyOn(component.activate, 'emit');
    const event = new Event('mouseenter');
    component.onMouseenter(event);
    expect(component.activate.emit).toHaveBeenCalled();
  });

  it('should emit treeAction event on tree action', () => {
    spyOn(component.treeAction, 'emit');
    component.onTreeAction();
    expect(component.treeAction.emit).toHaveBeenCalled();
  });

  it('should return correct css class', () => {
    component.isSelected = true;
    component.rowIndex = 1;
    expect(component.cssClass).toContain('active');
    expect(component.cssClass).toContain('table-row-even');
  });

  it('should return correct columnsTotalWidths', () => {
    component['_columnGroupWidths'] = { total: '100rem' };
    expect(component.columnsTotalWidths).toBe('100rem');
  });

  it('should call markForCheck on row change', () => {
    spyOn(component['cd'], 'markForCheck');
    component.row = { id: 1 };
    component.ngDoCheck();
    expect(component['cd'].markForCheck).toHaveBeenCalled();
  });
});
