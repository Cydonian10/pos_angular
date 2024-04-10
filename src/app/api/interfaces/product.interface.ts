export interface Product {
  id: number;
  stock: number;
  salePrice: number;
  purchasePrice: number;
  image: string;
  description: string;
  size: string;
  name: string;
  barCode: number;
  quantitySale: number;
  category: string;
  unitMeasurement: string;
  brand: string;
}

export interface CreateProductDto {
  stock: number;
  salePrice: number;
  purchasePrice: number;
  description: string;
  size: string;
  name: string;
  categoryId: number;
  brandId: number;
  unitMeasurementId: number;
  barCode: number;
  image?: File;
}

export interface UpdateProductDto extends CreateProductDto {}

export interface FilterProduct {
  name: string | null;
  price: number | null;
  stock: number | null;
  barCode: number | null;
}

export interface HistoryProductPrice {
  id: number;
  productId: number;
  oldPrice: number;
  name: string;
  date: Date;
}
