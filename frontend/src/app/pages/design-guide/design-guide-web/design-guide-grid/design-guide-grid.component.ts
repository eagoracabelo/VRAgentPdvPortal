import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'vr-design-guide-grid',
  templateUrl: './design-guide-grid.component.html',
  styleUrls: ['./design-guide-grid.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DesignGuideGridComponent implements OnInit {
  template!: string;

  ngOnInit(): void {
    this.template = ` <div class="row">
    <div class="col-sm-2 col-md-2 col-lg-2">col 2</div>
    <div class="col-sm-10 col-md-10 col-lg-10">col 10</div>
  </div>
  <div class="row">
    <div class="col-sm-3 col-md-3 col-lg-3">col 3</div>
    <div class="col-sm-9 col-md-9 col-lg-9">col 9</div>
  </div>
  <div class="row">
    <div class="col-sm-4 col-md-4 col-lg-4">col 4</div>
    <div class="col-sm-8 col-md-8 col-lg-8">col 8</div>
  </div>
  <div class="row">
    <div class="col-sm-5 col-md-5 col-lg-5">col 5</div>
    <div class="col-sm-7 col-md-7 col-lg-7">col 7</div>
  </div>
  <div class="row">
    <div class="col-sm-6 col-md-6 col-lg-6">col 6</div>
    <div class="col-sm-6 col-md-6 col-lg-6">col 6</div>
  </div>
  <div class="row">
    <div class="col-sm-7 col-md-7 col-lg-7">col 7</div>
    <div class="col-sm-5 col-md-5 col-lg-5">col 5</div>
  </div>
  <div class="row">
    <div class="col-sm-8 col-md-8 col-lg-8">col 8</div>
    <div class="col-sm-4 col-md-4 col-lg-4">col 4</div>
  </div>
  <div class="row">
    <div class="col-sm-9 col-md-9 col-lg-9">col 9</div>
    <div class="col-sm-3 col-md-3 col-lg-3">col 3</div>
  </div>
  <div class="row">
    <div class="col-sm-10 col-md-10 col-lg-10">col 10</div>
    <div class="col-sm-2 col-md-2 col-lg-2">col 2</div>
  </div>
  <div class="row">
    <div class="col-sm-11 col-md-11 col-lg-11">col 11</div>
    <div class="col-sm-1 col-md-1 col-lg-1">col 1</div>
  </div>`;
  }
}
