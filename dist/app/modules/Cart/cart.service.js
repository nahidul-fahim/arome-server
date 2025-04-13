"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const validate_user_1 = require("../../../utils/validate-user");
const validate_product_inventory_1 = require("../../../utils/validate-product-inventory");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const http_status_codes_1 = require("http-status-codes");
const validate_authorized_1 = require("../../../utils/validate-authorized");
// create new cart
const createCartIntoDB = (data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validate_user_1.validateUser)(data.customerId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER]);
    const vendorIds = new Set();
    const cartItemsWithDetails = yield Promise.all(data.cartItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield (0, validate_product_inventory_1.validateProductInventory)(item.productId, item.quantity);
        vendorIds.add(product.vendorId);
        return {
            productId: item.productId,
            quantity: item.quantity,
        };
    })));
    if (vendorIds.size > 1)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "All products in the cart must be from the same vendor.");
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const existingCart = yield tx.cart.findUnique({
            where: {
                customerId: data.customerId
            }
        });
        let cart;
        if (existingCart) {
            yield tx.cartItem.deleteMany({
                where: {
                    cartId: existingCart.id
                }
            });
            cart = yield tx.cart.update({
                where: {
                    id: existingCart.id
                },
                data: {
                    updatedAt: new Date()
                }
            });
        }
        else {
            cart = yield tx.cart.create({
                data: {
                    customer: {
                        connect: {
                            userId: data.customerId
                        }
                    },
                },
            });
        }
        ;
        yield tx.cartItem.createMany({
            data: cartItemsWithDetails.map((item) => (Object.assign(Object.assign({}, item), { cartId: cart.id })))
        });
        return yield tx.cart.findUnique({
            where: { id: cart.id },
            include: {
                cartItems: true
            }
        });
    }));
    return result;
});
// get single cart
const getSingleCartFromDB = (cartId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    const currentCart = yield prisma_1.default.cart.findUnique({
        where: {
            id: cartId
        },
        include: {
            cartItems: true
        }
    });
    if (!currentCart)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Cart not found!");
    yield (0, validate_authorized_1.validateAuthorized)(currentCart === null || currentCart === void 0 ? void 0 : currentCart.customerId, currentUser === null || currentUser === void 0 ? void 0 : currentUser.role, userId);
    return currentCart;
});
const updateCartIntoDB = (cartId, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER]);
    const currentCart = yield prisma_1.default.cart.findUniqueOrThrow({
        where: {
            id: cartId
        },
        include: {
            cartItems: true
        }
    });
    yield (0, validate_authorized_1.validateAuthorized)(currentCart.customerId, currentUser.role, userId);
    if (!data.cartItem || data.cartItem.length === 0) {
        yield prisma_1.default.cartItem.deleteMany({ where: { cartId } });
        const updatedCart = yield prisma_1.default.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: true },
        });
        return updatedCart;
    }
    const vendorIds = new Set();
    const cartItemsWithDetails = yield Promise.all(data.cartItem.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        const product = yield (0, validate_product_inventory_1.validateProductInventory)(item.productId, item.quantity);
        vendorIds.add(product.vendorId);
        return {
            cartItemId: item.cartItemId,
            productId: item.productId,
            quantity: item.quantity,
        };
    })));
    if (vendorIds.size > 1) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "All products in the cart must be from the same vendor.");
    }
    return yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        for (const item of cartItemsWithDetails) {
            if (item.cartItemId) {
                yield tx.cartItem.update({
                    where: { id: item.cartItemId },
                    data: { quantity: item.quantity },
                });
            }
            else {
                yield tx.cartItem.create({
                    data: {
                        cartId: cartId,
                        productId: item.productId,
                        quantity: item.quantity,
                    },
                });
            }
        }
        const updatedCart = yield tx.cart.findUnique({
            where: { id: cartId },
            include: { cartItems: true },
        });
        return updatedCart;
    }));
});
const deleteCartFromDB = (cartId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER]);
    const currentCart = yield prisma_1.default.cart.findUniqueOrThrow({
        where: {
            id: cartId
        }
    });
    yield (0, validate_authorized_1.validateAuthorized)(currentCart === null || currentCart === void 0 ? void 0 : currentCart.customerId, currentUser === null || currentUser === void 0 ? void 0 : currentUser.role, userId);
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.cartItem.deleteMany({
            where: {
                cartId
            }
        });
        yield tx.cart.delete({
            where: {
                id: cartId
            }
        });
        return {
            message: "Cart deleted successfully!"
        };
    }));
    return result;
});
exports.CartServices = {
    createCartIntoDB,
    getSingleCartFromDB,
    updateCartIntoDB,
    deleteCartFromDB
};
