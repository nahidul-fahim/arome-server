export interface IOrderItem {
  id?: string;
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IShippingDetails {
  id?: string
  address: string;
  phone: string;
  email: string;
  cityId: string;
  orderId: string;
}

export interface IOrder {
  id?: string;
  customerId: string;
  vendorId: string;
  couponId?: string;
  orderItems: IOrderItem[];
  shippingDetails: IShippingDetails;
  status?: "PENDING" | "PAID" | "SHIPPED" | "COMPLETED" | "CANCELLED";
  totalAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
}