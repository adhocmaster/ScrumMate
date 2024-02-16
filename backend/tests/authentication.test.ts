import { authentication } from '../src/helpers';

describe('testing authentication', () => {
  test('empty string should result in some string', () => {
    expect(authentication('', '')).toBe("c6e71b14a9af9efeac7f2ab5bfa056feb08fe77896e412f9751fd2013c55c332");
  });
});