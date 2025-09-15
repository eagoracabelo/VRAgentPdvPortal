import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[vrc-icon-style]',
  exportAs: 'vrc-icon-style',
})
export class IconStyleDirective implements AfterViewInit {
  private _name!: string;
  private _toggle!: string;

  private _currentOptionId = 0;
  private readonly _toggleOptions: Map<number, string> = new Map();

  @Input() public width!: string | number;
  @Input() public height!: string | number;
  @Input() public rotate!: string | number;
  @Input() public filter!: string;
  @Input() public cssClass!: string;
  @Input() public url!: string;

  private readonly element!: HTMLElement;

  constructor(
    private readonly _elementRef: ElementRef<HTMLElement>,
    private readonly _cd: ChangeDetectorRef,
  ) {
    this.element = _elementRef.nativeElement;
  }

  @Input()
  set name(name: string) {
    this._name = name;
    this.updateName();
    this._toggleOptions.set(0, name);
    this._cd.markForCheck();
  }

  @Input()
  set toggle(toggle: string) {
    this._toggle = toggle;
    this._toggleOptions.set(1, toggle);
  }

  get name(): string {
    return this._name;
  }

  get toggle(): string {
    return this._toggle;
  }

  ngAfterViewInit(): void {
    this.setName();
    this.setUrl();
    this.setSize();
    this.setBackgroundSize();
    this.setRotate();
    this.setFiler();
    this.setCssClass();
    this._cd.detectChanges();
  }

  @HostListener('click')
  onClick(): void {
    this._currentOptionId = this._currentOptionId ? 0 : 1;
    const name = this._toggleOptions.get(this._currentOptionId) as string;

    this.resetName();
    this.setName(name);
  }

  private setName(name = this.name): void {
    this.element.classList.add(`vr`);
    this.element.classList.add(`vr-${name}`);
  }

  private updateName(): void {
    this.resetName();
    this.setName();
  }

  private resetName(): void {
    this.element.classList.remove('vr');

    const classNameRemove = this.element.className
      .split(' ')
      .find((className) => /vr-*/.test(className));

    if (classNameRemove) {
      this.element.classList.remove(classNameRemove);
    }
  }

  private setUrl(): void {
    if (this.url) {
      this.element.style.background = `url(${this.url})`;
    }
  }

  private setSize(): void {
    if (this.width && this.height) {
      this.element.style.width = `${this.width}px`;
      this.element.style.height = `${this.height}px`;
    } else {
      if (this.width && !this.height) {
        this.element.style.width = `${this.width}px`;
      }
      if (!this.width && this.height) {
        this.element.style.height = `${this.height}px`;
      }
    }
  }

  private setBackgroundSize(): void {
    if (this.width && this.height) {
      this.element.style.backgroundSize = `${this.width}px ${this.height}px`;
    } else {
      if (this.width && !this.height) {
        this.element.style.backgroundSize = `${this.width}px`;
      }
      if (!this.width && this.height) {
        this.element.style.backgroundSize = `${this.height}px`;
      }
    }
  }

  private setRotate(): void {
    if (this.rotate) {
      this.element.style.transform = `rotate(${this.rotate}deg)`;
    }
  }

  private setFiler(): void {
    if (this.filter) {
      this.element.style.filter = this.filter;
    }
  }

  private setCssClass(): void {
    if (this.cssClass) {
      this.element.classList.add(`${this.cssClass}`);
    }
  }
}
