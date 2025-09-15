import {
  ChangeDetectionStrategy,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'vrc-nav-support',
  templateUrl: './vrc-nav-support.component.html',
  styleUrls: ['./vrc-nav-support.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcNavSuporteComponent {
  @Input() linkSupport = 'https://vrsoftware.movidesk.com/';
}
