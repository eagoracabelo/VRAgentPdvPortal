import { Component, DebugElement } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { VrcIconModule } from '../../vrc-icon';

import { MenuBreakDirective } from './menu-break.directive';

@Component({
  selector: 'test-MenuBreakDirective-component',
  template: `
    <div vrMenuBreak class="main-sidebar__menu-item">
      <div class="main-sidebar__submenu--container">
        <a class="main-sidebar__link--disabled" href="#">
          <vrc-icon>
            <i aria-hidden="true" class="vr vr-rede"></i>
          </vrc-icon>
          <span>Fiscal</span>
        </a>
        <div class="main-sidebar__submenu scroll">
          <div class="main-sidebar__title">
            <span>Fiscal</span>
          </div>
          <div class="main-sidebar__separator"></div>
          <div class="main-sidebar__submenu-item">
            <a
              class="main-sidebar__submenu-title--container main-sidebar__link--disabled"
              href="#"
            >
              <vrc-icon>
                <i aria-hidden="true" class="vr vr-pasta_aberta"></i>
              </vrc-icon>
              <span class="main-sidebar__submenu-title">Nota Fiscal</span>
            </a>
            <div class="main-sidebar__submenu scroll">
              <div class="main-sidebar__title">
                <span>Nota Fiscal</span>
              </div>
              <div class="main-sidebar__separator"></div>
              <div class="main-sidebar__submenu--container--last">
                <a class="main-sidebar__submenu-title--container" href="#">
                  <vrc-icon>
                    <i aria-hidden="true" class="vr vr-emissao_nota_fiscal"></i>
                  </vrc-icon>
                  <span class="main-sidebar__submenu-title"
                    >Emissão de Nota Fiscal</span
                  >
                </a>
              </div>
              <div class="main-sidebar__submenu--container--last">
                <a class="main-sidebar__submenu-title--container" href="#">
                  <vrc-icon>
                    <i
                      aria-hidden="true"
                      class="vr vr-recebimento_nota_fiscal"
                    ></i>
                  </vrc-icon>
                  <span class="main-sidebar__submenu-title"
                    >Recebimento de Nota Fiscal</span
                  >
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
class BaseTestComponent {}

describe('MenuBreakDirective', () => {
  let component: BaseTestComponent;
  let fixture: ComponentFixture<BaseTestComponent>;
  let menuDebug: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VrcIconModule],
      declarations: [MenuBreakDirective, BaseTestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    menuDebug = fixture.debugElement.query(By.directive(MenuBreakDirective));
  });

  beforeEach(async () => {
    window.innerHeight = 1080;
    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();
  });

  afterEach(fakeAsync(() => {
    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    tick(50);
  }));

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should mouseenter in Menu', () => {
    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    for (const subMmenu of subMmenus) {
      expect(subMmenu.styles['marginTop']).toBeDefined();
    }
  });

  it('should mouseenter in Menu and exists marginTop', () => {
    window.innerHeight = 100;
    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    const containsOneMarginTop = subMmenus.some(
      (subMmenu) => subMmenu.styles['marginTop'] !== '',
    );

    expect(containsOneMarginTop).toBeTruthy();
  });

  it('should mouseleave in Menu and not exists marginTop', () => {
    window.innerHeight = 100;
    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    const containsOneMarginTop = subMmenus.some(
      (subMmenu) => subMmenu.styles['marginTop'] !== '',
    );

    expect(containsOneMarginTop).toBeTruthy();

    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    const notContainsOneMarginTop = subMmenus.some(
      (subMmenu) => subMmenu.styles['marginTop'] !== '',
    );

    expect(notContainsOneMarginTop).toBeFalse();
  });

  it('should mouseleave in Menu', () => {
    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    for (const subMmenu of subMmenus) {
      expect(subMmenu.styles['marginTop']).toBeDefined();
    }
  });

  it('should mouseenter in SubMenu', () => {
    const subs = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu-item'),
    );
    for (const sub of subs) {
      sub.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    }
    fixture.detectChanges();
    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    for (const subMmenu of subMmenus) {
      expect(subMmenu.styles['marginTop']).toBeDefined();
    }
  });

  it('should mouseenter in SubMenu and exists marginTop', () => {
    window.innerHeight = 100;
    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const subs = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu-item'),
    );
    for (const sub of subs) {
      sub.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    }
    fixture.detectChanges();
    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    const containsOneMarginTop = subMmenus.some(
      (subMmenu) => subMmenu.styles['marginTop'] !== '',
    );

    expect(containsOneMarginTop).toBeTruthy();
  });

  it('should mouseleave in SubMenu and not exists marginTop', () => {
    window.innerHeight = 100;
    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    const subs = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu-item'),
    );
    for (const sub of subs) {
      sub.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    }
    menuDebug.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();
    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    const notContainsOneMarginTop = subMmenus.some(
      (subMmenu) => subMmenu.styles['marginTop'] !== '',
    );

    expect(notContainsOneMarginTop).toBeFalse();
  });

  it('should mouseleave in SubMenu', () => {
    const subs = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu-item'),
    );
    for (const sub of subs) {
      sub.nativeElement.dispatchEvent(new MouseEvent('mouseleave'));
    }
    fixture.detectChanges();
    const subMmenus = fixture.debugElement.queryAll(
      By.css('.main-sidebar__submenu'),
    );

    for (const subMmenu of subMmenus) {
      expect(subMmenu.styles['marginTop']).toBeDefined();
    }
  });
});
