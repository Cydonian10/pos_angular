import { Product } from './product.interface';

export interface CreatePurchaseDto {
  taxes: number;
  date: Date;
  supplierId: number;
  details: DetailPurchase[];
}

export interface DetailPurchase {
  product: Product;
  quantity: number;
  subTotal: number;
  purchasePrice: number;
}

export interface Purchase {
  id: number;
  name: string;
  totalPrice: number;
  products: ProductPurchase[];
}

export interface ProductPurchase {
  quantity: number;
  subTotal: number;
  name: string;
  purchasePrice: number;
  brand: string;
  unit: string;
}

export interface FormPurchaseDetail {
  purchasePrice: number;
  quantity: number;
}
