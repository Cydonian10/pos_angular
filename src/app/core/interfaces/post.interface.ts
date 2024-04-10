import { Product } from '@/api/interfaces/product.interface';

export interface PostItem {
  product: Product;
  quantity: number;
  discount: number;
  subTotal: number;
}
