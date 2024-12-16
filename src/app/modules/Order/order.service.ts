import { UserRole, UserStatus } from "@prisma/client";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma";
import { IOrder, IOrderItem } from "./order.interface";

// create new order
const createOrderIntoDb = async (data: IOrder) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: data.customerId,
      status: UserStatus.ACTIVE,
      role: UserRole.CUSTOMER
    }
  });
  await prisma.user.findUniqueOrThrow({
    where: {
      id: data.vendorId,
      status: UserStatus.ACTIVE,
      role: UserRole.VENDOR
    },
  });
  let totalAmount = 0;
  for (const item of data.orderItems) {
    const product = await prisma.product.findUniqueOrThrow({
      where: {
        id: item.productId,
      }
    });
    if (product.inventory < item.quantity) {
      throw new ApiError(400, `Insufficient inventory for product ${product.name}`);
    }
    Number(totalAmount += item.price * item.quantity).toFixed(2);
  }
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId: data.customerId,
        vendorId: data.vendorId,
        totalAmount: Number(totalAmount.toFixed(2)),
      },
      include: {
        orderItems: true
      }
    });
    const items = data.orderItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
      orderId: order.id,
    }));
    await tx.orderItem.createMany({
      data: items,
    });
    const fullOrder = await tx.order.findUniqueOrThrow({
      where: { id: order.id },
      include: { orderItems: true },
    });
    return fullOrder;
  });
  return result;
};

// get all orders
const getAllOrdersFromDb = async () => {
  const result = await prisma.order.findMany({
    include: {
      orderItems: true,
    }
  });
  return result;
}
// get single order
const getSingleOrderFromDb = async (id: string) => {
  const result = await prisma.order.findUniqueOrThrow({
    where: {
      id
    },
    include: {
      orderItems: true,
    }
  });
  return result;
};

// get customer all orders
const getCustomerAllOrdersFromDb = async (customerId: string) => {
  await prisma.customer.findUniqueOrThrow({
    where: {
      id: customerId,
      isDeleted: false
    }
  });
  const result = await prisma.order.findMany({
    where: {
      customerId
    },
    include: {
      orderItems: true,
    }
  });
  return result;
}

// update order
const updateOrderIntoDb = async (id: string, data: Partial<IOrder>) => {
  await prisma.order.findUniqueOrThrow({
    where: {
      id
    }
  });
  const result = await prisma.order.update({
    where: {
      id
    },
    data,
    include: {
      orderItems: true,
    }
  });
  return result;
}

// delete order
const deleteOrderFromDb = async (id: string) => {
  const result = await prisma.order.delete({
    where: {
      id
    }
  });
  return result;
}

export const OrderServices = {
  createOrderIntoDb,
  getAllOrdersFromDb,
  getSingleOrderFromDb,
  getCustomerAllOrdersFromDb,
  updateOrderIntoDb,
  deleteOrderFromDb
}
