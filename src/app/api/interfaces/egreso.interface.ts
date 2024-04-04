export interface Egreso {
  id: number;
  name: string;
  egreso: number;
  monto: number;
  cashRegisterId: number;
  createDate: Date;
}

export interface CreateEgresoDto {
  name: string;
  egreso: number;
  monto: number;
  cashRegisterId: number;
  createDate: Date;
}
