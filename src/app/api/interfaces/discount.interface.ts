export interface Discount {
  name: string;
  discountedPrice: number;
  minimumDiscountQuantity: number;
}

export interface CreateDiscountDto {
  name: string;
  discountedPrice: number;
  minimumDiscountQuantity: number;
}
