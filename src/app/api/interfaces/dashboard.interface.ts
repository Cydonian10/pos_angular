export interface Stadistics {
  totalInventoryPrice: number;
  totalInventoryCost: number;
  totalSalesPrice: number;
  totalProducts: number;
}

export interface LeastSoldProduct {
  name: string;
  stock: number;
  quantitySale: number;
  unitSymbol: string;
}

export interface TopSales {
  customerId: number;
  userName: string;
  totalSales: number;
}

export interface ProductsLowStock {
  name: string;
  stock: number;
  quantitySale: number;
  unitSymbol: string;
}
