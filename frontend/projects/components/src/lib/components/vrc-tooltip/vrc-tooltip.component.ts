import {
  ConnectedPosition,
  ConnectionPositionPair,
  Overlay,
} from '@angular/cdk/overlay';
import {
  Component,
  computed,
  HostListener,
  input,
  Input,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { EPositions } from './enums/positions.enum';
import { TPositions } from './types/positons.type';

export interface Inset {
  top: number;
  bottom: number;
  right: number;
  left: number;
}

@Component({
  selector: 'vrc-tooltip',
  templateUrl: './vrc-tooltip.component.html',
  styleUrls: ['./vrc-tooltip.component.scss'],
})
export class VrcTooltipComponent implements OnInit {
  @Input() message: string | string[] = 'Mensagem Default';
  @Input() error: boolean = false;
  @Input() small: boolean = false;
  @Input() width: number = 0;
  @Input() bottomRight: boolean = true;
  @Input() bottomLeft: boolean = false;
  @Input() topRight: boolean = false;
  @Input() topLeft: boolean = false;
  @Input() icon?: string;
  tooltipOverlay = input<boolean>(false);

  isArray = false;

  position = signal<TPositions>(EPositions.BottomRight);
  tooltipHover = signal<boolean>(false);

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.tooltipHover.set(true);
  }

  @HostListener('mouseout')
  onMouseOut(): void {
    this.tooltipHover.set(false);
  }

  cdkPositions: Signal<ConnectionPositionPair[]> = computed(() => {
    if (this.tooltipOverlay()) {
      try {
        return [this.addIfHasPosition[this.position()]()];
      } catch {
        return [this.cdkPositionBottomRight()];
      }
    }

    return [];
  });

  private readonly OFFSET_X = 4;
  private readonly OFFSET_Y = 4;

  private addIfHasPosition: { [key in EPositions]: () => ConnectedPosition } = {
    [EPositions.BottomRight]: this.cdkPositionBottomRight.bind(this),
    [EPositions.BottomLeft]: this.cdkPositionBottomLeft.bind(this),
    [EPositions.TopRight]: this.cdkPositionTopRight.bind(this),
    [EPositions.TopLeft]: this.cdkPositionTopLeft.bind(this),
  };

  constructor(public overlay: Overlay) {}

  ngOnInit(): void {
    this.setTooltipWidth();
    this.isArray = Array.isArray(this.message);
    this.setPositions();
  }

  private setPositions(): void {
    if (this.bottomRight) {
      this.position.set(EPositions.BottomRight);
    }

    if (this.bottomLeft) {
      this.position.set(EPositions.BottomLeft);
    }

    if (this.topRight) {
      this.position.set(EPositions.TopRight);
    }

    if (this.topLeft) {
      this.position.set(EPositions.TopLeft);
    }
  }

  private cdkPositionBottomRight(): ConnectedPosition {
    return {
      originX: 'end',
      originY: 'bottom',
      overlayX: 'start',
      overlayY: 'top',
      offsetX: this.OFFSET_X,
      offsetY: this.OFFSET_Y,
    };
  }

  private cdkPositionBottomLeft(): ConnectedPosition {
    return {
      originX: 'start',
      originY: 'bottom',
      overlayX: 'end',
      overlayY: 'top',
      offsetX: -this.OFFSET_X,
      offsetY: this.OFFSET_Y,
    };
  }

  private cdkPositionTopRight(): ConnectedPosition {
    return {
      originX: 'end',
      originY: 'top',
      overlayX: 'start',
      overlayY: 'bottom',
      offsetX: this.OFFSET_X,
      offsetY: -this.OFFSET_Y,
    };
  }

  private cdkPositionTopLeft(): ConnectedPosition {
    return {
      originX: 'start',
      originY: 'top',
      overlayX: 'end',
      overlayY: 'bottom',
      offsetX: -this.OFFSET_X,
      offsetY: -this.OFFSET_Y,
    };
  }

  private setTooltipWidth(): void {
    if (!this.width) return;
    const style = document.createElement('style');
    style.innerHTML = `.tooltip-width-${this.width} { max-width: ${this.width}rem; }`;
    document.getElementsByTagName('head')[0].appendChild(style);
  }
}
