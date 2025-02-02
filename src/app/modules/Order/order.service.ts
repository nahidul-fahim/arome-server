import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IOrder } from "./order.interface";
import { validateUser } from "../../../utils/validate-user";
import { validateProductInventory } from "../../../utils/validate-product-inventory";

// create new order
const createOrderIntoDb = async (data: IOrder) => {
  await validateUser(data.customerId, UserStatus.ACTIVE, UserRole.CUSTOMER);
  await validateUser(data.vendorId, UserStatus.ACTIVE, UserRole.VENDOR);
  let totalAmount = 0;
  const itemsWithPrice = await Promise.all(
    data.orderItems.map(async (item) => {
      const product = await validateProductInventory(item.productId, item.quantity);
      totalAmount += product?.price * item?.quantity;
      return {
        productId: item.productId,
        quantity: item.quantity,
        price: product?.price
      }
    })
  );
  const result = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId: data.customerId,
        vendorId: data.vendorId,
        totalAmount: Number(totalAmount.toFixed(2)),
      }
    });

    await tx.orderItem.createMany({
      data: itemsWithPrice.map((item) => ({
        ...item,
        orderId: order.id
      }))
    });

    const completedOrder = await tx.order.findUnique({
      where: {
        id: order.id,
      },
      include: {
        orderItems: true
      }
    });
    return completedOrder;
  })
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
