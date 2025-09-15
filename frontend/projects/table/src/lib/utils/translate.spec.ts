import { getVendorPrefixedName } from './prefixes';
import { translateXY } from './translate';
let transform =
  typeof window !== 'undefined'
    ? getVendorPrefixedName('transform')
    : undefined;
describe('Translate', () => {
  it('Should be Translate function', () => {
    const tipos = {
      style: {
        value: 'translate(100px, 100px)',
      },
    };
    const y = 2;
    const x = 3;
    const data = translateXY(tipos, y, x);
    expect(data).toBeUndefined();
  });
});
