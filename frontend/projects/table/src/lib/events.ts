/* eslint-disable */
declare let global: any;

export const MouseEvent = (
  ((typeof window !== 'undefined' && window) as any) || global
).MouseEvent as MouseEvent;
export const KeyboardEvent = (
  ((typeof window !== 'undefined' && window) as any) || global
).KeyboardEvent as KeyboardEvent;
export const Event = (
  ((typeof window !== 'undefined' && window) as any) || global
).Event as Event;
