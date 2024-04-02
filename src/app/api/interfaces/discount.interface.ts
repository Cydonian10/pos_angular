export interface Discount {
  id: number;
  name: string;
  discountedPrice: number;
  minimumDiscountQuantity: number;
}

export interface CreateDiscountDto {
  name: string;
  discountedPrice: number;
  minimumDiscountQuantity: number;
}
