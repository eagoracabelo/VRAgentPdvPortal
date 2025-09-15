import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { IJSONObject } from '../../shared/interfaces/json-object.interface';
import { sidebarClasses } from './constants/sidebar-classes';

@Component({
  selector: 'vrc-sidebar',
  templateUrl: './vrc-sidebar.component.html',
  styleUrls: ['./vrc-sidebar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  private _menuItens!: IJSONObject[];

  @Input() set menuItens(value: IJSONObject[]) {
    this._menuItens = value;
    setTimeout(() => {
      this.iterateMenu(this.menuItens, this._router.url);
    }, 0);
  }
  get menuItens(): IJSONObject[] {
    return this._menuItens;
  }

  @Input() systemVersion = '';

  sidebarLevel = -1;

  destroy$ = new Subject<boolean>();

  constructor(
    private readonly _renderer: Renderer2,
    private readonly _router: Router,
  ) {}

  ngOnInit(): void {
    this.sidebarLevel = 1;
    this._renderer.addClass(document.body, sidebarClasses[this.sidebarLevel]);
  }

  ngAfterViewInit(): void {
    this.watchUrl();
  }

  isSidebarRightLevel(): boolean {
    return this.sidebarLevel === 0 || this.sidebarLevel === 1;
  }

  isSidebarLeftLevel(): boolean {
    return this.sidebarLevel === 1 || this.sidebarLevel === 2;
  }

  watchUrl(): void {
    this._router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.iterateMenu(this.menuItens, event.url);
      }
    });
  }

  iterateMenu(menuItens: unknown[], target: string): void {
    const targetArray = target.split('/');

    menuItens.forEach((item) => {
      const menuItem = item as { id: number; rota: string; submenu: unknown[] };
      const hasSubmenu = menuItem.submenu.length > 0;

      const rota = menuItem.rota.split('/').pop() as string;

      const active = !hasSubmenu && targetArray.includes(rota);
      this.toggleActiveMenuItem(menuItem.id, active);

      if (hasSubmenu) this.iterateMenu(menuItem.submenu, target);
    });
  }

  toggleActiveMenuItem(id: number, add: boolean): void {
    const element = document.getElementById(`${id}`);

    if (!element) return;

    const className = element.tagName === 'DIV' ? 'active-div' : 'active-item';
    if (add) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }

  toggleSidebar(updateLeft: number, updateRight: number): void {
    this._renderer.removeClass(
      document.body,
      sidebarClasses[this.sidebarLevel],
    );
    this.sidebarLevel += updateRight - updateLeft;
    this._renderer.addClass(document.body, sidebarClasses[this.sidebarLevel]);
  }

  forceHiddenToggleButton(): void {
    const els = document.getElementsByClassName('main-sidebar__toggle-arrow');

    if (els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        const el = els.item(i);

        if (el) {
          el.setAttribute('style', 'opacity: 0');
        }
      }
    }
  }

  removeForcedHidden(): void {
    const els = document.getElementsByClassName('main-sidebar__toggle-arrow');

    if (els.length > 0) {
      for (let i = 0; i < els.length; i++) {
        const el = els.item(i);

        if (el) {
          el.setAttribute('style', 'opacity: null');
        }
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
