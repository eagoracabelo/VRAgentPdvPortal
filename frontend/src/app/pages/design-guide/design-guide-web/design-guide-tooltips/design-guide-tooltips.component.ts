import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vr-design-guide-tooltips',
  templateUrl: './design-guide-tooltips.component.html',
  styleUrls: ['./design-guide-tooltips.component.scss'],
})
export class DesignGuideTooltipsComponent implements OnInit {
  template!: string;

  ngOnInit(): void {
    this.template = `    <a class="btn btn--default tooltip-top" href="#" data-tooltip="TOOLTIP TOP">TOP</a>
    <a class="btn btn--default tooltip-right" href="#" data-tooltip="TOOLTIP RIGHT">RIGHT</a>
    <a class="btn btn--default tooltip-bottom" href="#" data-tooltip="TOOLTIP BOOTOM">BOOTOM</a>
    <a class="btn btn--default tooltip-left" href="#" data-tooltip="TOOLTIP LEFT">LEFT</a>`;
  }
}
