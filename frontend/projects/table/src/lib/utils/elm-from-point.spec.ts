import { elementsFromPoint } from './elm-from-point';

describe('Translate', () => {
  it('Should be Translate function', () => {
    const y = 2;
    const x = 3;
    const data = elementsFromPoint(y, x) as [];
  });
});
