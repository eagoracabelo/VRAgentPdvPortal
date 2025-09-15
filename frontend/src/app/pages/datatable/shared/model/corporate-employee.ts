/**
 * A model for an individual corporate employee
 */
export class CorporateEmployee {
  id: number;
  name: string;
  gender: string;
  company: string;
  quantity: string;
  money: number;
  currency: string;
  currencyParaguai: string;
  discount: string;
  age?: number;

  constructor(
    id: number,
    name: string,
    gender: string,
    company: string,
    quantity: string,
    money: number,
    currency: string,
    currencyParaguai: string,
    discount: string,
    age?: number,
  ) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.company = company;
    this.quantity = quantity;
    this.money = money;
    this.currency = currency;
    this.currencyParaguai = currencyParaguai;
    this.discount = discount;
    this.age = age;
  }
}
