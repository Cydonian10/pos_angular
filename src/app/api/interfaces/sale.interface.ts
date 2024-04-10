import { Product } from './product.interface';

export interface Bill {
  id: number;
  vaucherNumber: number;
  taxes: number;
  totalPrice: number;
  date: Date;
  user: string;
  customer: string;
  cashRegister: string;
  totalDescount: number;
  productos: ProductBill[];
}

export interface ProductBill {
  quantity: number;
  name: string;
  categoria: string;
  marca: string;
  unit: string;
  subTotal: number;
  descount: number;
}

export interface CreateSaleDto {
  taxex: number;
  createDate: Date;
  customerId: number;
  cashRegisterId: number;
  totalPrice: number;
  statusCompra: number;
  saleDetails: SaleDetail[];
}

export interface SaleDetail {
  product: Product;
  quantity: number;
  subTotal: number;
  discount: number;
}

export interface FilterSaleByDate {
  starDate: Date;
  endDate: Date;
}
