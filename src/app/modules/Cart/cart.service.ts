import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { validateUser } from "../../../utils/validate-user";
import { ICart } from "./cart.interface";
import { validateProductInventory } from "../../../utils/validate-product-inventory";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";
import { validateAuthorized } from "../../../utils/validate-authorized";

// create new cart
const createCartIntoDB = async (data: ICart) => {
    await validateUser(data.customerId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);
    const vendorIds = new Set<string>();
    const cartItemsWithDetails = await Promise.all(data.cartItem.map(async (item) => {
        const product = await validateProductInventory(item.productId, item.quantity);
        vendorIds.add(product.vendorId);
        return {
            productId: item.productId,
            quantity: item.quantity,
        };
    }));

    if (vendorIds.size > 1) throw new ApiError(StatusCodes.BAD_REQUEST, "All products in the cart must be from the same vendor.");

    const result = await prisma.$transaction(async (tx) => {
        const existingCart = await tx.cart.findUnique({
            where: {
                customerId: data.customerId
            }
        });
        let cart;
        if (existingCart) {
            await tx.cartItem.deleteMany({
                where: {
                    cartId: existingCart.id
                }
            });
            cart = await tx.cart.update({
                where: {
                    id: existingCart.id
                },
                data: {
                    updatedAt: new Date()
                }
            })
        }
        else {
            cart = await tx.cart.create({
                data: {
                    customer: {
                        connect: {
                            userId: data.customerId
                        }
                    },
                },
            });
        };

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

// get single cart
const getSingleCartFromDB = async (cartId: string, userId: string) => {
    const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
    const currentCart = await prisma.cart.findUnique({
        where: {
            id: cartId
        },
        include: {
            cartItems: true
        }
    });
    if (!currentCart) throw new ApiError(StatusCodes.NOT_FOUND, "Cart not found!");
    await validateAuthorized(currentCart?.customerId, currentUser?.role, userId);
    return currentCart;
}

const updateCartIntoDB = async (cartId: string, userId: string, data: Partial<ICart>) => {
    const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);
    const currentCart = await prisma.cart.findUniqueOrThrow({
        where: {
            id: cartId
        },
        include: {
            cartItems: true
        }
    });
    await validateAuthorized(currentCart.customerId, currentUser.role, userId);
    if (!data.cartItem || data.cartItem.length === 0) {
        await prisma.cartItem.deleteMany({ where: { cartId } });
        const updatedCart = await prisma.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: true },
        });
        return updatedCart;
    }
    const vendorIds = new Set<string>();
    const cartItemsWithDetails = await Promise.all(data.cartItem.map(async (item) => {
        const product = await validateProductInventory(item.productId, item.quantity);
        vendorIds.add(product.vendorId);
        return {
            cartItemId: item.cartItemId,
            productId: item.productId,
            quantity: item.quantity,
        };
    }));
    if (vendorIds.size > 1) {
        throw new ApiError(StatusCodes.BAD_REQUEST, "All products in the cart must be from the same vendor.");
    }
    return await prisma.$transaction(async (tx) => {
        for (const item of cartItemsWithDetails) {
            if (item.cartItemId) {
                await tx.cartItem.update({
                    where: { id: item.cartItemId },
                    data: { quantity: item.quantity },
                });
            } else {
                await tx.cartItem.create({
                    data: {
                        cartId: cartId,
                        productId: item.productId,
                        quantity: item.quantity,
                    },
                });
            }
        }

        const updatedCart = await tx.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: true },
        });

        return updatedCart;
    });
};

const deleteCartFromDB = async (cartId: string, userId: string) => {
    const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.CUSTOMER]);
    const currentCart = await prisma.cart.findUniqueOrThrow({
        where: {
            id: cartId
        }
    })
    await validateAuthorized(currentCart?.customerId, currentUser?.role, userId);
    const result = await prisma.$transaction(async (tx) => {
        await tx.cartItem.deleteMany({
            where: {
                cartId
            }
        })
        await tx.cart.delete({
            where: {
                id: cartId
            }
        })
        return {
            message: "Cart deleted successfully!"
        }
    })
    return result;
};

export const CartServices = {
    createCartIntoDB,
    getSingleCartFromDB,
    updateCartIntoDB,
    deleteCartFromDB
}