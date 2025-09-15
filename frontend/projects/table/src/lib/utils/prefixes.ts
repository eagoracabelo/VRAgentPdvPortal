/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { camelCase } from './camel-case';

const cache = {} as any;
const testStyle: any =
  typeof document !== 'undefined'
    ? document.createElement('div').style
    : undefined;

// Get Prefix
// http://davidwalsh.name/vendor-prefix
const prefix = (function ():
  | {
      dom: any;
      lowercase: string | undefined;
      css: string;
      js: string | undefined;
    }
  | undefined {
  const styles =
    typeof window !== 'undefined'
      ? window.getComputedStyle(document.documentElement, '')
      : undefined;
  const match =
    typeof styles !== 'undefined'
      ? /-(moz|webkit|ms)-/.exec(Array.prototype.slice.call(styles).join(''))
      : null;
  const pre = match !== null ? match[1] : undefined;

  const navigator = 'WebKit|Moz|MS|O'.match(new RegExp(`(${pre})`, 'i'));

  let dom!: any;

  if (typeof pre !== 'undefined') {
    if (navigator && navigator.length >= 2) {
      dom = navigator[1];
    }
  }

  return dom
    ? {
        dom,
        lowercase: pre,
        css: `-${pre}-`,
        js:
          pre && pre.length > 1 ? pre[0].toUpperCase() + pre.substring(1) : pre,
      }
    : undefined;
})();

export function getVendorPrefixedName(property: string): any {
  const name = camelCase(property);

  if (!cache[name]) {
    if (
      prefix !== undefined &&
      testStyle[prefix.css + property] !== undefined
    ) {
      cache[name] = prefix.css + property;
    } else if (testStyle[property] !== undefined) {
      cache[name] = property;
    }
  }

  return cache[name];
}
