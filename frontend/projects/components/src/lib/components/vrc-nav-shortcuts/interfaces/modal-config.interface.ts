import { Type } from '@angular/core';

export interface IModalConfig<T = unknown, Y = unknown> {
  component: Type<T>;
  options: Y;
}
