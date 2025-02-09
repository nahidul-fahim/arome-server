import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { IOrder } from "./order.interface";
import { validateUser } from "../../../utils/validate-user";
import { validateProductInventory } from "../../../utils/validate-product-inventory";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import { validateOrder } from "../../../utils/validate-order";

const createOrderIntoDb = async (data: IOrder) => {
  await validateUser(data.customerId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);
  await validateUser(data.vendorId, UserStatus.ACTIVE, [UserRole.VENDOR]);
  let totalAmount = 0;
  const itemsWithPrice = await Promise.all(
    data.orderItems.map(async (item) => {
      const product = await validateProductInventory(item.productId, item.quantity);
      totalAmount += product?.price * item?.quantity;
      return {
        productId: item.productId,
        productName: product.name,
        productImage: product.image,
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

    await tx.product.updateMany({
      where: {
        id: {
          in: itemsWithPrice.map((item) => item.productId)
        }
      },
      data: {
        quantity: {
          decrement: itemsWithPrice.map((item) => item.quantity)
        }
      }
    });

    await tx.cartItem.deleteMany({
      // TODO: delete cart items
    });

    await tx.cart.delete({
      where: {
        id: data.cartId 
        // TODO: delete cart
      }
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

export const OrderServices = {
  createOrderIntoDb,
  getAllOrdersFromDb,
  getVendorAllOrdersFromDb,
  getCustomerAllPurchasesFromDb,
  getSingleOrderFromDb
}
