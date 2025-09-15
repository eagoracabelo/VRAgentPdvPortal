export enum ImagesEnum {
  Documento_Texto = 'vr-documento_texto',
  Documento_Xlsx = 'vr-documento_xlsx',
  Canary = 'vr-canary',
}

export enum CopyrightImagesEnum {
  VRDark = 'logo-vr-dark',
  TipoVRDark = 'tipo-vr-dark',
  VRLight = 'logo-vr-light',
  TipoVRLight = 'tipo-vr-light',
}

export enum ListagemProdutoImagesEnum {
  Acougue = 'acougue',
  Compras = 'compras',
  Frutas = 'frutas',
  Legumes = 'legumes',
  Padaria = 'padaria',
  Verduras = 'verduras',
}

export enum LoginImagesEnum {
  CarrinhoSupermercado = 'carrinho-supermercado',
}

export enum LogotiposImagesEnum {
  DesignGuide = 'vrdesignguide',
  Components = 'vrcomponents',
  VRMasterWeb = 'vrmasterweb',
  VRSoftware = 'vrsoftware',
}

export enum PageImagesEnum {
  AccessDenied = 'page-access-denied',
  NotFound = 'page-not-found',
  UnderConstruction = 'under-construction',
}

export function imagesEnumToArray(): string[] {
  return Object.values(ImagesEnum);
}

export function imagesCopyrightEnumToArray(): string[] {
  return Object.values(CopyrightImagesEnum);
}

export function imageListagemProdutoPDVEnumToArray(): string[] {
  return Object.values(ListagemProdutoImagesEnum);
}

export function imageLoginEnumToArray(): string[] {
  return Object.values(LoginImagesEnum);
}

export function imageLogotiposEnumToArray(): string[] {
  return Object.values(LogotiposImagesEnum);
}

export function imagePageEnumToArray(): string[] {
  return Object.values(PageImagesEnum);
}
