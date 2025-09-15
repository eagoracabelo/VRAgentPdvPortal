import { Component, Input } from '@angular/core';

@Component({
  selector: 'vrc-nav-toolbar',
  templateUrl: './vrc-nav-toolbar.component.html',
  styleUrls: ['./vrc-nav-toolbar.component.scss'],
})
export class VrcNavToolbarComponent {
  @Input()
  title!: string;
}
