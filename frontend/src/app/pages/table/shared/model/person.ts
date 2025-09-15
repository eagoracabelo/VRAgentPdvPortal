interface IProduct {
  id: number;
  car: string;
}

export class Person {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  gender: string;
  car: string;
  product: IProduct;

  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    gender: string,
    car: string,
    product: IProduct,
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.gender = gender;
    this.car = car;
    this.product = product;
  }
}
