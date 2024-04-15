export interface CreateEmpresaDto {
  name: string;
  ruc: string;
  address: string;
  image?: any;
}

export interface Empresa {
  id: number;
  name: string;
  ruc: string;
  address: string;
  image: string | null;
}
