export interface Supplier {
  id: number;
  name: string;
  adress: string;
  phone: string;
}

export interface CreateSupplierDto {
  name: string;
  adress: string;
  phone: string;
}
