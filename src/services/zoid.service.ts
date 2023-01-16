import { UpdateZoidDto } from '../dto/zoid.dto';
import { Zoid } from '../interfaces';
import { zoid } from '../config';
import { getISODate } from '../util';
import { logger } from '../util/logger';

import currency from 'currency.js';

export class ZoidService {
  private price = zoid.defaultPrice;
  private updatedAt = getISODate();

  async getPrice(): Promise<number> {
    return this.price;
  }

  async setZoid({ price }: UpdateZoidDto): Promise<Zoid> {
    logger.verbose('set Zoid price');

    const savingPrice = currency(price).value;
    this.price = savingPrice;
    this.updatedAt = getISODate();

    logger.verbose('Zoid price set');
    return this.getZoid();
  }

  async getZoid(): Promise<Zoid> {
    const { price, updatedAt } = this;
    return {
      price,
      updatedAt,
    };
  }
}

export default new ZoidService();
