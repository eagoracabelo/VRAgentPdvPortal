import {
  getLocalStorage,
  getPageSizeStorage,
  setLocalStorage,
} from './storage-helper';

describe('Storage Helper', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('getLocalStorage', () => {
    it('should return null if the storage item does not exist', () => {
      expect(getLocalStorage('nonexistent')).toBeNull();
    });

    it('should return null if the storage item is not a valid JSON string', () => {
      localStorage.setItem('invalid', btoa('invalid'));
      expect(getLocalStorage('invalid')).toBeNull();
    });

    it('should return the parsed object if the storage item is a valid JSON string', () => {
      const obj = { key: 'value' };
      localStorage.setItem('valid', btoa(JSON.stringify(obj)));
      expect(getLocalStorage('valid')).toEqual(obj);
    });
  });

  describe('setLocalStorage', () => {
    it('should remove the item if the object is null', () => {
      localStorage.setItem('item', 'value');
      setLocalStorage('item', null);
      expect(localStorage.getItem('item')).toBeNull();
    });

    it('should set the item if the object is not null', () => {
      const obj = { key: 'value' };
      setLocalStorage('item', obj);
      expect(localStorage.getItem('item')).toBe(btoa(JSON.stringify(obj)));
    });
  });

  describe('getPageSizeStorage', () => {
    it('should return the minimum page size option if the storage item does not exist', () => {
      const pageSizeOptions = [10, 20, 30];
      expect(getPageSizeStorage('pageSize', pageSizeOptions)).toBe(10);
    });

    it('should return the stored page size if it is a valid option', () => {
      const pageSizeOptions = [10, 20, 30];
      localStorage.setItem('pageSize', btoa('20'));
      expect(getPageSizeStorage('pageSize', pageSizeOptions)).toBe(20);
    });

    it('should return the minimum page size option if the stored value is not a valid option', () => {
      const pageSizeOptions = [10, 20, 30];
      localStorage.setItem('pageSize', btoa('40'));
      expect(getPageSizeStorage('pageSize', pageSizeOptions)).toBe(10);
    });

    it('should return the minimum page size option if the stored value is not a number', () => {
      const pageSizeOptions = [10, 20, 30];
      localStorage.setItem('pageSize', btoa('invalid'));
      expect(getPageSizeStorage('pageSize', pageSizeOptions)).toBe(10);
    });
  });
});
