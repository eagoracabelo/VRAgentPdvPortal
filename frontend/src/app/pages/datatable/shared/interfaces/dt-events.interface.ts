import { TDtTypeEvent } from '../types/dt-type-event.type';

export interface IDtEvents<T> {
  type: TDtTypeEvent;
  event: MouseEvent | PointerEvent | KeyboardEvent | Event;
  row: T;
  rowElement: HTMLElement;
}
