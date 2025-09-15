import { Component } from '@angular/core';

@Component({
  selector: 'vrc-footer',
  templateUrl: './vrc-footer.component.html',
})
export class VrcFooterComponent {
  private readonly _currentDate: Date;

  constructor() {
    this._currentDate = new Date();
  }

  public get currentDate(): Date {
    return this._currentDate;
  }
}
