import { OrderStatus, UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { validateUser } from "../../../utils/validate-user";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import { validateOrder } from "../../../utils/validate-order";
import { IOrder, IShippingDetails } from "./order.interface";
import { validateProductInventory } from "../../../utils/validate-product-inventory";

const createOrderIntoDB = async (data: IOrder, paymentDetails: any) => {
  const customerId = data.customerId;
  await validateUser(customerId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);
  const cart = await prisma.cart.findUnique({
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
  };

  const isValidCity = await prisma.city.findUnique({
    where: {
      id: data.shippingDetails.cityId
    }
  })
  if (!isValidCity) throw new ApiError(StatusCodes.NOT_FOUND, "Please select a valid city.");

  await Promise.all(
    cart.cartItems.map(async (item) => {
      await validateProductInventory(item.product.id, item.quantity);
    })
  );

  const totalAmount = cart.cartItems.reduce((total, item) => {
    const price = item.product.price.toNumber();
    return total + price * item.quantity;
  }, 0);

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
            quantity: item.quantity,
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

const updateOrderShippingDetailsIntoDb = async (
  orderId: string,
  userId: string,
  data: IShippingDetails
) => {
  await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { customer: true, ShippingDetails: true },
  });

  if (!order) throw new ApiError(StatusCodes.NOT_FOUND, "Order not found.");
  if (order.customer.userId !== userId) {
    throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to update this order.");
  }
  if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAID) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "The order is shipped already!");
  }

  if (data.cityId) {
    const isValidCity = await prisma.city.findUnique({
      where: { id: data.cityId }
    });
    if (!isValidCity) throw new ApiError(StatusCodes.NOT_FOUND, "Please select a valid city.");
  }

  const existingShippingDetails = order.ShippingDetails;
  const isSameData = (
    data.address === existingShippingDetails!.address &&
    data.phone === existingShippingDetails!.phone &&
    data.email === existingShippingDetails!.email &&
    data.cityId === existingShippingDetails!.cityId
  );

  if (isSameData) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No changes detected. Nothing was updated.");
  }

  const updatedShippingDetails = await prisma.shippingDetails.update({
    where: { orderId: orderId },
    data: {
      address: data.address,
      phone: data.phone,
      email: data.email,
      cityId: data.cityId
    }
  });

  return { ...order, ShippingDetails: updatedShippingDetails };
};


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
};

export const OrderServices = {
  createOrderIntoDB,
  getAllOrdersFromDb,
  getVendorAllOrdersFromDb,
  getCustomerAllPurchasesFromDb,
  getSingleOrderFromDb,
  updateOrderShippingDetailsIntoDb,
  deleteOrderFromDb
}
