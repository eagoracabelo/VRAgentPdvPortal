import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'vrc-icon',
  templateUrl: './vrc-icon.component.html',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VrcIconComponent implements AfterViewInit {
  private _name!: string;

  @Input() public toggle!: string;
  @Input() public width!: string | number;
  @Input() public height!: string | number;
  @Input() public rotate!: string | number;
  @Input() public filter!: string;
  @Input() public cssClass!: string;
  @Input() public url!: string;

  constructor(private readonly _cd: ChangeDetectorRef) {}

  @Input()
  set name(name: string) {
    this._name = name;
    this._cd.markForCheck();
  }

  get name(): string {
    return this._name;
  }

  ngAfterViewInit(): void {
    this._cd.detectChanges();
  }
}
