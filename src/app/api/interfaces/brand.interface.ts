export interface Brand {
  id: number;
  name: string;
  description: string;
  image: string;
}

export interface CreateBrandDto {
  name: string;
  description: string;
  image?: File;
}

export interface UpdateBrandDto extends CreateBrandDto {}
