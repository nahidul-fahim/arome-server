export interface IOrderItem {
  productId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  id?: string;
  customerId: string;
  vendorId: string;
  orderItems: IOrderItem[];
  status?: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}