export interface CashRegister {
  id: number;
  name: string;
  initialCash: number;
  date: Date;
  open: boolean;
  totalCash: number;
  userId: string;
}

export interface CreateCashRegisterDto {
  name: string;
  date: Date;
}

export interface UpdateCashRegisterDto {
  name: string;
}

export interface OpenCashRegisterDto {
  initialCash: number;
}
