import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'vrc-navbar',
  templateUrl: './vrc-navbar.component.html',
  styleUrls: ['./vrc-navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcNavbarComponent implements OnInit {
  @Input() logoLink = '';

  /**
   * Class name for the logo image.
   * @default 'vrmasterweb'
   * @type {string}
   * ⚠️ This property is optional, and substitutes the logoSrc property.
   **/
  @Input() logoClass?: string;

  logo: string = '';

  ngOnInit(): void {
    if (this.logoClass) {
      this.logo = this.logoClass;
      return;
    }

    this.logo = 'vrmasterweb';
  }
}
