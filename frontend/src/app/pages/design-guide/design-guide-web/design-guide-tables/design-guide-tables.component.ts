import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vr-design-guide-tables',
  templateUrl: './design-guide-tables.component.html',
  styleUrls: ['./design-guide-tables.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignGuideTablesComponent implements OnInit {
  template!: string;

  ngOnInit(): void {
    this.template = `    <h4>Default</h4>
    <table class="table"></table>

    <h4>Bordered</h4>
    <table class="table table--bordered">
      ...
    </table>

    <h4>Hover</h4>
    <table class="table table--hover">
      ...
    </table>

    <h4>Responsive</h4>
    <div class="table-responsive">
      <table class="table">
        ...
      </table>
    </div>
    `;
  }
}
