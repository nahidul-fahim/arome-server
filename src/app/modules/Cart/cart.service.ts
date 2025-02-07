import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { validateUser } from "../../../utils/validate-user";
import { ICart } from "./cart.interface";
import { validateProductInventory } from "../../../utils/validate-product-inventory";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import { validateAuthorized } from "../../../utils/validate-authorized";

// create new cart
const createCartIntoDb = async (data: ICart) => {
    await validateUser(data.customerId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);

    const vendorIds = new Set<string>();
    const cartItemsWithDetails = await Promise.all(data.cartItem.map(async (item) => {
        const product = await validateProductInventory(item.productId, item.quantity);
        if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found!");
        vendorIds.add(product.vendorId);
        return {
            productId: item.productId,
            quantity: item.quantity,
            price: product.price
        };
    }));

    if (vendorIds.size > 1) throw new ApiError(400, "All products in the cart must be from the same vendor.");

    const result = await prisma.$transaction(async (tx) => {
        const cart = await tx.cart.create({
            data: {
                customerId: data.customerId,
            }
        });

        await tx.cartItem.createMany({
            data: cartItemsWithDetails.map((item) => ({
                ...item,
                cartId: cart.id
            }))
        });

        return await tx.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: true
            }
        });
    });
    return result;
};

// get customer cart
const getCustomerCartFromDb = async (customerId: string, userId: string) => {
    const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
    const currentCart = await prisma.cart.findUniqueOrThrow({
        where: {
            customerId
        },
        include: {
            cartItems: true
        }
    });
    await validateAuthorized(currentCart.customerId, currentUser?.role, userId);
    return currentCart;
}

export const CartServices = {
    createCartIntoDb,
    getCustomerCartFromDb
}