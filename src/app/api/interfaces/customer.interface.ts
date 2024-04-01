export interface Customer {
  id: number;
  name: string;
  phone: string;
  dni: string;
  address: string;
  points: number;
}

export interface CreateCustomerDto {
  name: string;
  phone: string | null;
  DNI: string;
  address: string | null;
}

export interface UpdateCustomerDto {
  name: string;
  phone: string | null;
  DNI: string;
  address: string | null;
}
