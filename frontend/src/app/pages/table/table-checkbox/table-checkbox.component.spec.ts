import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCheckboxComponent } from './table-checkbox.component';

describe('TableCheckboxComponent', () => {
  let component: TableCheckboxComponent;
  let fixture: ComponentFixture<TableCheckboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCheckboxComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
