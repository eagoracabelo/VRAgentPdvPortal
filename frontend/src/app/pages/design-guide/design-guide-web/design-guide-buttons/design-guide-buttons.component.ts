import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vr-design-guide-buttons',
  templateUrl: './design-guide-buttons.component.html',
  styleUrls: ['./design-guide-buttons.component.scss'],
})
export class DesignGuideButtonsComponent implements OnInit {
  template!: string;

  ngOnInit(): void {
    this.template = `<h4>Button Class</h4>
    <div class="col-xs-12 center-itens">
      <a class="btn">Anchor</a>
      <button class="btn">Button Element</button>
      <input class="btn" type="button" value="Button input">
      <input class="btn" type="submit" value="Submit input">
      <input class="btn" type="reset" value="Reset input">
    </div>
    <h4>Classic Styles</h4>
    <div class="col-xs-12 center-itens">
      <button class="btn btn--default">Default</button>
      <a class="btn btn--primary">Primary</a>
      <button class="btn btn--secondary">Secondary</button>
      <input class="btn btn--success" type="submit" value="Success">
      <input class="btn btn--info" type="button" value="Info">
      <input class="btn btn--warning" type="button" value="Warning">
      <input class="btn btn--danger" type="reset" value="Danger">
    </div>
    <h4>Large Buttons</h4>
    <div class="col-xs-12 center-itens">
      <button class="btn btn--default btn--lg">Large Default</button>
      <a class="btn btn--primary btn--lg">Large Primary</a>
      <button class="btn btn--secondary btn--lg">Large Outline</button>
      <button class="btn btn--success btn--raised btn--lg">Large Raised</button>
    </div>
    <h4>Outline Buttons</h4>
    <div class="col-xs-12 center-itens">
      <button class="btn btn-outline--default">Default</button>
      <a class="btn btn-outline--primary"> Primary</a>
      <a class="btn btn-outline--secondary">Secondary</a>
      <button class="btn btn-outline--success">Success</button>
      <button class="btn btn-outline--info">Info</button>
      <input class="btn btn-outline--warning" type="submit" value="Warning">
      <input class="btn btn-outline--danger" type="button" value="Danger">
    </div>
    <h4>Raised Buttons</h4>
    <div class="col-xs-12 center-itens">
      <button class="btn btn--default btn--raised">Default</button>
      <a class="btn btn--primary btn--raised">Primary</a>
      <button class="btn btn--secondary btn--raised">Secondary</button>
      <input class="btn btn--success btn--raised" type="submit" value="Success">
      <input class="btn btn--info btn--raised" type="button" value="Info">
      <input class="btn btn--warning btn--raised" type="button" value="Warning">
      <input class="btn btn--danger btn--raised" type="reset" value="Danger">
    </div>`;
  }
}
