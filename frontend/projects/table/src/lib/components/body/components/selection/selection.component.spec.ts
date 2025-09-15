import { TestBed, ComponentFixture, waitForAsync } from '@angular/core/testing';
import { TableSelectionComponent } from './selection.component';

describe('TableSelectionComponent', () => {
  let fixture: ComponentFixture<TableSelectionComponent>;
  let component: TableSelectionComponent;

  // provide our implementations or mocks to the dependency injector
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableSelectionComponent],
    });
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TableSelectionComponent);
      component = fixture.componentInstance;
    });
  }));

  describe('fixture', () => {
    it('should have a component instance', () => {
      expect(component).toBeTruthy();
    });
  });
});
