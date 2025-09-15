import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScrollbarHelper } from '../../../../services/scrollbar-helper.service';
import { DataTableBodyCellComponent } from '../body-cell/body-cell.component';
import { DataTableBodyRowComponent } from './body-row.component';

describe('DataTableBodyRowComponent', () => {
  let fixture: ComponentFixture<DataTableBodyRowComponent>;
  let component: DataTableBodyRowComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataTableBodyCellComponent, DataTableBodyRowComponent],
      providers: [ScrollbarHelper],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableBodyRowComponent);
      component = fixture.componentInstance;
    });
  }));

  it('should have a component instance', () => {
    expect(component).toBeTruthy();
  });

  it('should be _element contains class', () => {
    const row = { num: 1 };

    component.row = row;

    component.selectedRowClicked = row;

    expect(component._element.classList.contains('active-row')).toBeTrue();
  });

  it('should be _element not contains class', () => {
    const row = { num: 1 };

    component.row = row;

    component.selectedRowClicked = { num: 2 };

    expect(component._element.classList.contains('active-row')).toBeFalse();
  });
  describe('rowAdd', () => {
    it('should set flex-direction to column when rowAdd is true', () => {
      const row = { num: 1 };
      component.rowAdd = row;
      expect(component._element.getAttribute('style')).toContain(
        'flex-direction: column;',
      );
    });

    it('should remove flex-direction when rowAdd is false', () => {
      const row = { num: 1 };
      component.rowAdd = row;
      component.rowAdd = null;
      expect(component._element.getAttribute('style')).toBeNull();
    });

    it('should return the value of rowAdd', () => {
      const row = { num: 1 };
      component.rowAdd = row;
      expect(component.rowAdd).toEqual(row);
    });
  });
});
