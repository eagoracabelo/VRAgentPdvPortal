import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrcFooterComponent } from './vrc-footer.component';

describe('VrcFooterComponent', () => {
  let component: VrcFooterComponent;
  let fixture: ComponentFixture<VrcFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VrcFooterComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
