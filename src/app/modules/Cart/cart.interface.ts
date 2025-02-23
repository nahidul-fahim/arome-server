export interface ICart {
    id?: string;
    customerId: string;
    createdAt?: Date;
    updatedAt?: Date;
    cartItem: ICartITem[];
}

export interface ICartITem {
    id?: string;
    cartId?: string;
    cartItemId?: string;
    productId: string;
    quantity: number;
}