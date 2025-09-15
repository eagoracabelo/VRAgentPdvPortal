import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrcNavbarComponent } from './vrc-navbar.component';

describe('VrcNavbarComponent', () => {
  let component: VrcNavbarComponent;
  let fixture: ComponentFixture<VrcNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VrcNavbarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set logo to logoClass if logoClass is provided', () => {
    component.logoClass = 'vrcomponents';
    component.ngOnInit();
    expect(component.logo).toBe('vrcomponents');
  });

  it('should set logo to default value if logoClass is not provided', () => {
    component.ngOnInit();
    expect(component.logo).toBe('vrmasterweb');
  });
});
