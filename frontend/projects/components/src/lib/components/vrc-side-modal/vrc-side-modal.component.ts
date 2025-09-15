import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { VrcSideModalService } from '../../services/vrc-side-modal.service';

@Component({
  selector: 'vrc-side-modal',
  templateUrl: './vrc-side-modal.component.html',
  styleUrls: ['./vrc-side-modal.component.scss'],
})
export class VrcSideModalComponent {
  @ViewChild('sideModal') sideModal!: ElementRef<HTMLDivElement>;
  @Input() width = '35vw';
  @Input() height = '45vh';
  @Input() top = 'unset';
  @Input() title = '';
  @Input() isDragable = true;
  private _dragableParentClass = '.content-wrapper';
  @Input() set dragableParentClass(value: string) {
    if (
      this.validateString(value) &&
      (value.startsWith('.') || value.startsWith('#'))
    ) {
      this._dragableParentClass = value;
    } else if (this.validateString(value)) {
      this._dragableParentClass = `.${value}`;
    }
  }
  get dragableParentClass(): string {
    return this._dragableParentClass;
  }

  active = false;
  drag = false;

  dragPosition: { x: number; y: number } | null = null;

  get classWidth(): string {
    return `side-modal-${this.width}-width`;
  }

  get classHeight(): string {
    return `side-modal-${this.height}-height`;
  }

  get classTop(): string {
    return `side-modal-${this.top}-top`;
  }

  get classSideModal(): string {
    return `${this.classWidth} ${this.classHeight} ${this.classTop}`;
  }

  constructor(private readonly service: VrcSideModalService) {
    this.addCustomStyle();
  }

  private validateString(value: string | undefined | null): boolean {
    return (
      typeof value === 'string' &&
      value !== undefined &&
      value !== null &&
      value.trim() !== ''
    );
  }

  private addCustomStyle(): void {
    const style = document.createElement('style');
    style.innerHTML = `
        .${this.classWidth} {
          max-width: ${this.width};
        }

        .${this.classHeight} {
          max-height: ${this.height};
        }

        .${this.classTop} {
          top: ${this.top};
        }
      `;
    document.head.appendChild(style);
  }

  private dragAction(): void {
    if (this.active) {
      this.dragPosition = null;
      this.sideModal.nativeElement.style.transform = 'translateX(100%)';
      this.sideModal.nativeElement.style.transition = '1s all ease';
    } else {
      this.sideModal.nativeElement.style.transform = 'translateX(0)';
    }
  }

  toggleSideModal(): void {
    if (this.isDragable) {
      if (this.drag) return;
      this.dragAction();
    }

    this.active = !this.active;
    this.service.setIsActive(this.active);
  }

  private pinAction(): void {
    this.sideModal.nativeElement.style.transition = 'none';

    if (this.drag)
      this.sideModal.nativeElement.style.transition = '1s all ease';

    if (this.drag) {
      this.dragPosition = {
        x: 0,
        y: 0,
      };
    }
  }

  pinToDrag(): void {
    if (this.isDragable) {
      if (!this.active) return;
      this.pinAction();
    }

    this.drag = !this.drag;
  }
}
