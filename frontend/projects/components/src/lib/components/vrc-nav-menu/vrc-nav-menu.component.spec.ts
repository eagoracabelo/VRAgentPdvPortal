import { Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VrcNavMenuComponent } from './vrc-nav-menu.component';
import { VrcNavMenuModule } from './vrc-nav-menu.module';

@Pipe({
  name: 'translator',
  pure: false,
})
export class TranslatorPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value;
  }
}

describe('VrcNavMenuComponent', () => {
  let component: VrcNavMenuComponent;
  let fixture: ComponentFixture<VrcNavMenuComponent>;

  const locationSpy = jasmine.createSpyObj('Location', ['reload']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcNavMenuModule],
      declarations: [VrcNavMenuComponent, TranslatorPipe],
      providers: [{ provide: Location, useValue: locationSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcNavMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle navbar menu', () => {
    expect(component.isNavbarMenuOpen).toBeFalse();
    component.toggleNavbarMenu();
    expect(component.isNavbarMenuOpen).toBeTrue();
    component.toggleNavbarMenu();
    expect(component.isNavbarMenuOpen).toBeFalse();
  });

  it('should emit isLogout event', () => {
    let isLogoutEmitted = false;
    component.isLogout.subscribe((value) => {
      isLogoutEmitted = value;
    });
    component.logout();
    expect(isLogoutEmitted).toBeTrue();
  });
});
