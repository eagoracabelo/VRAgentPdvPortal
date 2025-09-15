import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VrcThemeService } from '../../services/vrc-theme.service';

import { VrcNavThemeChangerComponent } from './vrc-nav-theme-changer.component';
import { VrcNavThemeChangerModule } from './vrc-nav-theme-changer.module';

describe('VrcNavThemeChangerComponent', () => {
  let component: VrcNavThemeChangerComponent;
  let fixture: ComponentFixture<VrcNavThemeChangerComponent>;
  let themeService: VrcThemeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcNavThemeChangerModule],
      declarations: [VrcNavThemeChangerComponent],
      providers: [VrcThemeService],
    }).compileComponents();

    fixture = TestBed.createComponent(VrcNavThemeChangerComponent);
    component = fixture.componentInstance;
    themeService = TestBed.inject(VrcThemeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setTheme', () => {
    spyOn(themeService, 'setTheme').and.callThrough();

    component.setTheme();

    expect(component.model.theme).toEqual('dark');
    expect(component.isLightTheme).toEqual(false);

    component.setTheme();

    expect(component.model.theme).toEqual('light');
    expect(component.isLightTheme).toEqual(true);

    expect(themeService.setTheme).toHaveBeenCalled();
  });
});
