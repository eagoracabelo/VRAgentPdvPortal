export class Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  company: string;
  gender: string;
  date: Date;
  value: number;
  version: string;
  ip_address: string;
  phone: string;
  job: string;
  app_name: string;
  creadit_card: string;
  city: string;
  country: string;

  constructor(
    id: number,
    first_name: string,
    last_name: string,
    email: string,
    company: string,
    gender: string,
    date: Date,
    value: number,
    version: string,
    ip_address: string,
    phone: string,
    job: string,
    app_name: string,
    creadit_card: string,
    city: string,
    country: string,
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.company = company;
    this.gender = gender;
    this.date = date;
    this.value = value;
    this.version = version;
    this.ip_address = ip_address;
    this.phone = phone;
    this.job = phone;
    this.app_name = app_name;
    this.creadit_card = creadit_card;
    this.city = city;
    this.country = country;
  }
}
