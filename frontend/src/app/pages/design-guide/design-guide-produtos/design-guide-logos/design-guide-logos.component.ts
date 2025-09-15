import { Component, Input } from '@angular/core';

@Component({
  selector: 'vr-design-guide-logos',
  templateUrl: './design-guide-logos.component.html',
  styleUrls: ['./design-guide-logos.component.scss'],
})
export class DesignGuideLogosComponent {
  @Input() productName!: string;
}
