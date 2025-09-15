import { AfterViewInit, Component, ElementRef, Input } from '@angular/core';
import { Option } from './models/option';

@Component({
  selector: 'vrc-option',
  templateUrl: './vrc-option.component.html',
})
export class VrcOptionComponent implements Option, AfterViewInit {
  @Input() value!: string;
  @Input() text!: string;
  @Input() isCurrent = false;
  content!: unknown;

  constructor(private readonly element: ElementRef<HTMLElement>) {}
  ngAfterViewInit(): void {
    this.content = this.element?.nativeElement?.innerHTML;
  }
}
