export class DataType {
  id: number | string;
  padStart: number | string;
  numerico: number;
  texto: string;
  inteiro: number;
  cep: string;
  cpf: string;
  cnpj: string;
  ncm: string;
  mercadologico: string;
  data: string;
  hora: string;
  dataHora: string;
  telefone: string;
  customizado: string;

  constructor(
    id: number | string,
    padStart: number | string,
    numerico: number,
    texto: string,
    inteiro: number,
    cep: string,
    cpf: string,
    cnpj: string,
    ncm: string,
    mercadologico: string,
    data: string,
    hora: string,
    dataHora: string,
    telefone: string,
    customizado: string,
  ) {
    this.id = id;
    this.padStart = padStart;
    this.numerico = numerico;
    this.texto = texto;
    this.inteiro = inteiro;
    this.cep = cep;
    this.cpf = cpf;
    this.cnpj = cnpj;
    this.ncm = ncm;
    this.mercadologico = mercadologico;
    this.data = data;
    this.hora = hora;
    this.dataHora = dataHora;
    this.telefone = telefone;
    this.customizado = customizado;
  }
}
