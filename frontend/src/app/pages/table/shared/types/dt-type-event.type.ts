import { EDtTypeEvent } from '../enums/dt-type-event.enum';

export type TDtTypeEvent =
  | EDtTypeEvent.keydown
  | EDtTypeEvent.click
  | EDtTypeEvent.dblclick
  | EDtTypeEvent.checkbox
  | EDtTypeEvent.mouseenter;
