import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { VrcIconModule } from '@vrsoftbr/vr-components';

import { EditColumnService } from './../../../../services/edit-column.service';
import { DataTableHeaderCellComponent } from './header-cell.component';

describe('DataTableHeaderCellComponent', () => {
  let fixture: ComponentFixture<DataTableHeaderCellComponent>;
  let component: DataTableHeaderCellComponent;
  let element: any;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [VrcIconModule],
      declarations: [DataTableHeaderCellComponent],
      providers: [EditColumnService],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DataTableHeaderCellComponent);
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
