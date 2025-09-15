import { IColumnPrintingPreference } from '../interfaces/printing-preference.interface';
import { Indexeddb } from './indexeddb';

describe('Indexeddb', () => {
  let indexeddb: Indexeddb;

  beforeEach(() => {
    indexeddb = new Indexeddb();
  });

  afterEach(async () => {
    await indexeddb.colunaPreferenciaImpressao.clear();
    await indexeddb.delete();
  });

  it('should be defined', async () => {
    expect(indexedDB).toBeDefined();
  });

  it('should insert one preferencia impressao', async () => {
    const data: IColumnPrintingPreference = {
      id: 1,
      key: 'key1',
      column: 'column1',
    };
    await indexeddb.deleteAllByKey(data.key);
    await indexeddb.insertOnePreferenciaImpressao(data);
    const result = await indexeddb.getAllPreferenciaImpressaoByKey('key1');
    expect(result).not.toBeUndefined();
  });

  it('should insert many preferencia impressao', async () => {
    const data: IColumnPrintingPreference[] = [
      { id: 1, key: 'key1', column: 'column1' },
      { id: 2, key: 'key1', column: 'column2' },
    ];
    await indexeddb.insertManyPreferenciaImpressao(data);
    const result = await indexeddb.getAllPreferenciaImpressaoByKey('key1');

    expect(result).not.toBeUndefined();
  });

  it('should get all preferencia impressao by key', async () => {
    const data: IColumnPrintingPreference[] = [
      { id: 3, key: 'key1', column: 'column1' },
      { id: 4, key: 'key1', column: 'column2' },
    ];
    await indexeddb.insertManyPreferenciaImpressao(data);
    const result = await indexeddb.getAllPreferenciaImpressaoByKey('key1');
    expect(result).not.toBeUndefined();
  });

  it('should delete all by key', async () => {
    const data: IColumnPrintingPreference[] = [
      { id: 5, key: 'key1', column: 'column1' },
      { id: 6, key: 'key1', column: 'column2' },
    ];
    await indexeddb.insertManyPreferenciaImpressao(data);
    await indexeddb.deleteAllByKey('key1');
    const result = await indexeddb.getAllPreferenciaImpressaoByKey('key1');
    expect(result).not.toBeUndefined();
  });

  it('should delete all by key and insert many', async () => {
    const data1: IColumnPrintingPreference[] = [
      { id: 8, key: 'key1', column: 'column1' },
      { id: 9, key: 'key1', column: 'column2' },
    ];
    const data2: IColumnPrintingPreference[] = [
      { id: 10, key: 'key1', column: 'column3' },
      { id: 11, key: 'key1', column: 'column4' },
    ];
    await indexeddb.insertManyPreferenciaImpressao(data1);
    await indexeddb.deleteAllByKeyAndInsertMany('key1', data2);
    const result = await indexeddb.getAllPreferenciaImpressaoByKey('key1');
    expect(result).not.toBeUndefined();
  });
});
