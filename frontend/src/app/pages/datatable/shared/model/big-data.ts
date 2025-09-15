export class BigData {
  _id: string;
  name: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  gender: string;

  constructor(
    _id: string,
    name: string,
    isActive: boolean,
    balance: string,
    picture: string,
    age: number,
    gender: string,
  ) {
    this._id = _id;
    this.name = name;
    this.isActive = isActive;
    this.balance = balance;
    this.picture = picture;
    this.age = age;
    this.gender = gender;
  }
}
