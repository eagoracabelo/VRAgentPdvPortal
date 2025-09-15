import { isPlatformBrowser } from '@angular/common';
import {
  Directive,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';

@Directive({
  selector: '[off-click]',
})
export class OffClickDirective implements OnInit, OnDestroy {
  @Input('off-click') offClickHandler!: EventListenerOrEventListenerObject;

  constructor(@Inject(PLATFORM_ID) private readonly platformId: string) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        document.addEventListener('click', this.offClickHandler);
      }, 0);
    }
  }

  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('click', this.offClickHandler);
    }
  }
}
