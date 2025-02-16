import { OrderStatus, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { validateUser } from "../../../utils/validate-user";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import { validateOrder } from "../../../utils/validate-order";
import { IOrder } from "./order.interface";

const createOrderIntoDB = async (data: IOrder, paymentDetails: any) => {
  const customerId = data.customerId;
  await validateUser(customerId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);
  const cart = await prisma.cart.findUniqueOrThrow({
    where: {
      customerId,
    },
    include: {
      cartItems: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Cart is empty!");
  }

  const totalAmount = cart.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const order = await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerId,
        vendorId: cart.cartItems[0].product.vendorId,
        totalAmount,
        status: OrderStatus.PENDING,
        orderItems: {
          create: cart.cartItems.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: item.product.image,
            quantity: item.quantity,
            price: item.price,
          })),
        },
        ShippingDetails: {
          create: {
            ...data.shippingDetails,
          }
        }
      },
    });

    await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
      },
    });

    await tx.cart.delete({
      where: {
        id: cart.id,
      },
    });

    await Promise.all(
      cart.cartItems.map(async (item) => {
        await tx.product.update({
          where: {
            id: item.productId,
          },
          data: {
            inventory: {
              decrement: item.quantity,
            },
          },
        });
      }),
    );

    return order;
  });

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      amount: totalAmount,
      status: "PENDING",
      method: "stripe",
    },
  });

  return { order, payment };
};

const getAllOrdersFromDb = async (adminId: string) => {
  await validateUser(adminId, UserStatus.ACTIVE, [UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  const result = await prisma.order.findMany({
    include: {
      orderItems: true,
    }
  });
  return result;
};

const getVendorAllOrdersFromDb = async (vendorId: string, userId: string) => {
  const vendor = await validateUser(vendorId, UserStatus.ACTIVE, [UserRole.VENDOR]);
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const isAuthorized = vendor?.id === userId || isAdmin;
  if (!isAuthorized) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  const result = await prisma.order.findMany({
    where: {
      vendorId
    },
    include: {
      orderItems: true,
    }
  });
  return result;
}

const getCustomerAllPurchasesFromDb = async (customerId: string, userId: string) => {
  const customer = await validateUser(customerId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);
  const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
  const isAuthorized = customer?.id === userId || isAdmin;
  if (!isAuthorized) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
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

const getSingleOrderFromDb = async (orderId: string, userId: string) => {
  const user = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
  const order = await validateOrder(orderId);
  const isAdmin = user.role === UserRole.ADMIN || user.role === UserRole.SUPER_ADMIN;
  const isAuthorized = order.customerId === userId || isAdmin;
  if (!isAuthorized) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  const result = await prisma.order.findUniqueOrThrow({
    where: {
      id: orderId
    },
    include: {
      orderItems: true,
    }
  });
  return result;
}

const deleteOrderFromDb = async (orderId: string, userId: string) => {
  const user = await validateUser(userId, UserStatus.ACTIVE, [UserRole.SUPER_ADMIN]);
  await validateOrder(orderId);
  const isSuperAdmin = user.role === UserRole.SUPER_ADMIN;
  if (!isSuperAdmin) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
  const result = await prisma.$transaction(async (tx) => {
    await tx.payment.deleteMany({
      where: {
        orderId
      }
    });
    await tx.orderItem.deleteMany({
      where: {
        orderId
      }
    });
    const deletedOrder = await tx.order.delete({
      where: {
        id: orderId
      }
    });
    return deletedOrder;
  })
  return result;
}

// todo: update order + adding shipping address to order in prisma schema

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDb,
  getVendorAllOrdersFromDb,
  getCustomerAllPurchasesFromDb,
  getSingleOrderFromDb,
  deleteOrderFromDb
}
