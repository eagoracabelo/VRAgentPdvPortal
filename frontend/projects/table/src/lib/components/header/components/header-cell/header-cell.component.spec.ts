import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TableHeaderCellComponent } from './header-cell.component';

describe('TableHeaderCellComponent', () => {
  let fixture: ComponentFixture<TableHeaderCellComponent>;
  let component: TableHeaderCellComponent;
  let element: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableHeaderCellComponent],
      providers: [],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TableHeaderCellComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });
});
