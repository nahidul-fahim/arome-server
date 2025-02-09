export interface IOrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  id?: string;
  customerId: string;
  vendorId: string;
  couponId?: string;
  orderItems: IOrderItem[];
  status?: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}