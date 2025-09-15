import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'vrc-nav-menu',
  templateUrl: './vrc-nav-menu.component.html',
  styleUrls: ['./vrc-nav-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcNavMenuComponent {
  private _isNavbarMenuOpen = false;
  @Output() isLogout = new EventEmitter<boolean>();
  @Input() iconName = 'loja';

  toggleNavbarMenu(): void {
    this._isNavbarMenuOpen = !this._isNavbarMenuOpen;
  }

  get isNavbarMenuOpen(): boolean {
    return this._isNavbarMenuOpen;
  }

  logout(): void {
    this.isLogout.emit(true);
  }
}
