export interface User {
  id: string;
  email: string;
  salary: number;
  name: string;
  birthday: Date;
  age: number;
  phone: string;
  dni: string;
  active: boolean;
}

export interface UserAuth extends User {
  roles: string[];
  claims: any[];
}

export interface CreateUserDto {
  salary: number;
  dateBirthday: Date;
  email: string;
  name: string;
  password: string;
  phone: string;
  DNI: string;
}

export interface LoginUserDto {
  email: string;
  password: string;
}

export interface AddRolDto {
  email: string;
  roles: string[];
}
export interface RemoveRolDto extends AddRolDto {}

export interface UserToken {
  token: string;
  expiración: Date;
  user: User;
}
