import { Component, Input, OnInit } from '@angular/core';
import { ITooltip } from './../../shared/interfaces/tooltip.interface';

const currencyMask = {
  mask: 'R$ num',
  blocks: {
    num: {
      mask: Number,
      scale: 2,
      padFractionalZeros: true,
      normalizeZeros: true,
      signed: true,
      thousandsSeparator: '.',
      radix: ',',
      min: -999999999999,
      max: 999999999999,
    },
  },
};

@Component({
  selector: 'vrc-card-value',
  templateUrl: './vrc-card-value.component.html',
  styleUrls: ['./vrc-card-value.component.scss'],
})
export class VrcCardValueComponent implements OnInit {
  @Input() width = 'max-content';
  @Input() title = 'TITLE';
  @Input() color = 'var(--color-text)';
  @Input() mask = currencyMask;
  @Input() secondaryMask = currencyMask;
  @Input() tooltip!: ITooltip;

  @Input() set value(value: string | number) {
    this._value = value.toString();
  }

  @Input() set secondaryValue(value: string | number) {
    this._secondaryValue = value.toString();
  }

  get value(): string {
    return this._value;
  }

  _value = '0';

  get secondaryValue(): string {
    return this._secondaryValue;
  }

  _secondaryValue!: string;

  get formattedColor(): string {
    return this.color?.replace(/#/g, '');
  }

  get classWidth(): string {
    return `card-value-${this.width}-width`;
  }

  get classBorderColor(): string {
    return `card-value-${this.formattedColor}-border`;
  }

  get classValueColor(): string {
    return `card-value-${this.formattedColor}-value`;
  }

  get classCard(): string {
    return `${this.classBorderColor} ${this.classWidth}`;
  }

  ngOnInit(): void {
    this.addCustomStyle();
  }

  private addCustomStyle(): void {
    const style = document.createElement('style');
    style.innerHTML = `
        .${this.classWidth} {
          width: ${this.width};
        }

        .${this.classBorderColor} {
          border-bottom-color: ${this.color} !important;
        }

        .${this.classValueColor} {
          color: ${this.color};
        }
      `;
    document.head.appendChild(style);
  }
}
