import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'vrc-text-editor-button',
  templateUrl: './vrc-text-editor-button.component.html',
  styleUrls: ['./vrc-text-editor-button.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class VrcTextEditorButtonComponent {
  @Input() isDisabled: boolean = false;
  @Input() title!: string;
  @Input() iconName!: string;
  @Input() iconFilter!: string;
  @Input() iconWidth!: string | number;
  @Input() iconHeight!: string | number;
  @Output() buttonClick = new EventEmitter();
}
