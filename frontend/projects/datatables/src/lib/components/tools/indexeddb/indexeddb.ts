import Dexie, { Table } from 'dexie';
import { IColumnPrintingPreference } from '../interfaces/printing-preference.interface';

export class Indexeddb extends Dexie {
  colunaPreferenciaImpressao!: Table<IColumnPrintingPreference, number>;

  constructor() {
    super('datatables');
    this.version(3).stores({
      colunaPreferenciaImpressao: '++id,key,column',
    });
  }

  public async insertOnePreferenciaImpressao(
    data: IColumnPrintingPreference,
  ): Promise<void> {
    const existing = await this.colunaPreferenciaImpressao
      .where('key')
      .equals(data.key)
      .first();

    if (existing?.id) {
      await this.colunaPreferenciaImpressao.update(existing.id, data);
    } else {
      await this.colunaPreferenciaImpressao.add(data);
    }
  }

  public async insertManyPreferenciaImpressao(
    data: IColumnPrintingPreference[],
  ): Promise<void> {
    await this.colunaPreferenciaImpressao.bulkPut(data);
  }

  public async getAllPreferenciaImpressaoByKey(
    key: string,
  ): Promise<IColumnPrintingPreference[]> {
    return await this.colunaPreferenciaImpressao
      .where('key')
      .equals(key)
      .toArray();
  }

  public async deleteAllByKey(key: string): Promise<void> {
    await this.transaction('rw', 'colunaPreferenciaImpressao', async () => {
      await this.colunaPreferenciaImpressao.where('key').equals(key).delete();
    });
  }

  public async deleteAllByKeyAndInsertMany(
    key: string,
    data: IColumnPrintingPreference[],
  ): Promise<void> {
    await this.deleteAllByKey(key);
    await this.insertManyPreferenciaImpressao(data);
  }
}
