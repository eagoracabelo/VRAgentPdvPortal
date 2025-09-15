import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableInputComponent } from './datatable-input.component';

describe('DatatableInputComponent', () => {
  let component: DatatableInputComponent;
  let fixture: ComponentFixture<DatatableInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatatableInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DatatableInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
