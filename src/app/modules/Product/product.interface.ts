export interface IProduct {
  name: string;
  price: number;
  image: string;
  categoryId: string;
  inventory: number;
  description: string;
  discount?: number;
  vendorId: string;
  shopId: string;
  createdAt?: Date;
  updatedAt?: Date;
}