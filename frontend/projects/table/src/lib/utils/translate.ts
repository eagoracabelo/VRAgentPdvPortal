/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { camelCase } from './camel-case';
import { getVendorPrefixedName } from './prefixes';

// browser detection and prefixing tools
const transform: string =
  typeof window !== 'undefined'
    ? getVendorPrefixedName('transform')
    : undefined;
const backfaceVisibility =
  typeof window !== 'undefined'
    ? getVendorPrefixedName('backfaceVisibility')
    : undefined;
const hasCSSTransforms =
  typeof window !== 'undefined'
    ? !!getVendorPrefixedName('transform')
    : undefined;
const hasCSS3DTransforms =
  typeof window !== 'undefined'
    ? !!getVendorPrefixedName('perspective')
    : undefined;
const ua =
  typeof window !== 'undefined' ? window.navigator.userAgent : 'Chrome';
const isSafari = /Safari\//.test(ua) && !/Chrome\//.test(ua);

export function translateXY(styles: any, x: number, y: number): void {
  if (typeof transform !== 'undefined' && hasCSSTransforms) {
    if (!isSafari && hasCSS3DTransforms) {
      styles[transform] = `translate3d(${x}rem, ${y}rem, 0)`;
      styles[backfaceVisibility] = 'hidden';
    } else {
      styles[camelCase(transform)] = `translate(${x}rem, ${y}rem)`;
    }
  } else {
    styles.top = `${y}rem`;
    styles.left = `${x}rem`;
  }
}
