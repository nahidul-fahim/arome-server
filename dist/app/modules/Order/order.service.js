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
exports.OrderServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const validate_user_1 = require("../../../utils/validate-user");
const api_error_1 = __importDefault(require("../../../errors/api-error"));
const http_status_codes_1 = require("http-status-codes");
const validate_order_1 = require("../../../utils/validate-order");
const validate_product_inventory_1 = require("../../../utils/validate-product-inventory");
const createOrderIntoDB = (data, paymentDetails) => __awaiter(void 0, void 0, void 0, function* () {
    const customerId = data.customerId;
    yield (0, validate_user_1.validateUser)(customerId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER]);
    const cart = yield prisma_1.default.cart.findUnique({
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
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "Cart is empty!");
    }
    ;
    const isValidCity = yield prisma_1.default.city.findUnique({
        where: {
            id: data.shippingDetails.cityId
        }
    });
    if (!isValidCity)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Please select a valid city.");
    yield Promise.all(cart.cartItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, validate_product_inventory_1.validateProductInventory)(item.product.id, item.quantity);
    })));
    const totalAmount = cart.cartItems.reduce((total, item) => {
        const price = item.product.price.toNumber();
        return total + price * item.quantity;
    }, 0);
    const order = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const order = yield tx.order.create({
            data: {
                customerId,
                vendorId: cart.cartItems[0].product.vendorId,
                totalAmount,
                status: client_1.OrderStatus.PENDING,
                orderItems: {
                    create: cart.cartItems.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
                ShippingDetails: {
                    create: Object.assign({}, data.shippingDetails)
                }
            },
        });
        yield tx.cartItem.deleteMany({
            where: {
                cartId: cart.id,
            },
        });
        yield tx.cart.delete({
            where: {
                id: cart.id,
            },
        });
        yield Promise.all(cart.cartItems.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            yield tx.product.update({
                where: {
                    id: item.productId,
                },
                data: {
                    inventory: {
                        decrement: item.quantity,
                    },
                },
            });
        })));
        return order;
    }));
    const payment = yield prisma_1.default.payment.create({
        data: {
            orderId: order.id,
            amount: totalAmount,
            status: "PENDING",
            method: "stripe",
        },
    });
    return { order, payment };
});
const getAllOrdersFromDb = (adminId) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validate_user_1.validateUser)(adminId, client_1.UserStatus.ACTIVE, [client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    const result = yield prisma_1.default.order.findMany({
        include: {
            orderItems: true,
        }
    });
    return result;
});
const getVendorAllOrdersFromDb = (vendorId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const vendor = yield (0, validate_user_1.validateUser)(vendorId, client_1.UserStatus.ACTIVE, [client_1.UserRole.VENDOR]);
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.VENDOR, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    const isAdmin = currentUser.role === client_1.UserRole.ADMIN || currentUser.role === client_1.UserRole.SUPER_ADMIN;
    const isAuthorized = (vendor === null || vendor === void 0 ? void 0 : vendor.id) === userId || isAdmin;
    if (!isAuthorized)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    const result = yield prisma_1.default.order.findMany({
        where: {
            vendorId
        },
        include: {
            orderItems: true,
        }
    });
    return result;
});
const getCustomerAllPurchasesFromDb = (customerId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield (0, validate_user_1.validateUser)(customerId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER]);
    const currentUser = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    const isAdmin = currentUser.role === client_1.UserRole.ADMIN || currentUser.role === client_1.UserRole.SUPER_ADMIN;
    const isAuthorized = (customer === null || customer === void 0 ? void 0 : customer.id) === userId || isAdmin;
    if (!isAuthorized)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    const result = yield prisma_1.default.order.findMany({
        where: {
            customerId
        },
        include: {
            orderItems: true,
        }
    });
    return result;
});
const getSingleOrderFromDb = (orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER, client_1.UserRole.ADMIN, client_1.UserRole.SUPER_ADMIN]);
    const order = yield (0, validate_order_1.validateOrder)(orderId);
    const isAdmin = user.role === client_1.UserRole.ADMIN || user.role === client_1.UserRole.SUPER_ADMIN;
    const isAuthorized = order.customerId === userId || isAdmin;
    if (!isAuthorized)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    const result = yield prisma_1.default.order.findUniqueOrThrow({
        where: {
            id: orderId
        },
        include: {
            orderItems: true,
        }
    });
    return result;
});
const updateOrderShippingDetailsIntoDb = (orderId, userId, data) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.CUSTOMER]);
    const order = yield prisma_1.default.order.findUnique({
        where: { id: orderId },
        include: { customer: true, ShippingDetails: true },
    });
    if (!order)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Order not found.");
    if (order.customer.userId !== userId) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.FORBIDDEN, "You are not authorized to update this order.");
    }
    if (order.status !== client_1.OrderStatus.PENDING && order.status !== client_1.OrderStatus.PAID) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "The order is shipped already!");
    }
    if (data.cityId) {
        const isValidCity = yield prisma_1.default.city.findUnique({
            where: { id: data.cityId }
        });
        if (!isValidCity)
            throw new api_error_1.default(http_status_codes_1.StatusCodes.NOT_FOUND, "Please select a valid city.");
    }
    const existingShippingDetails = order.ShippingDetails;
    const isSameData = (data.address === existingShippingDetails.address &&
        data.phone === existingShippingDetails.phone &&
        data.email === existingShippingDetails.email &&
        data.cityId === existingShippingDetails.cityId);
    if (isSameData) {
        throw new api_error_1.default(http_status_codes_1.StatusCodes.BAD_REQUEST, "No changes detected. Nothing was updated.");
    }
    const updatedShippingDetails = yield prisma_1.default.shippingDetails.update({
        where: { orderId: orderId },
        data: {
            address: data.address,
            phone: data.phone,
            email: data.email,
            cityId: data.cityId
        }
    });
    return Object.assign(Object.assign({}, order), { ShippingDetails: updatedShippingDetails });
});
const deleteOrderFromDb = (orderId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, validate_user_1.validateUser)(userId, client_1.UserStatus.ACTIVE, [client_1.UserRole.SUPER_ADMIN]);
    yield (0, validate_order_1.validateOrder)(orderId);
    const isSuperAdmin = user.role === client_1.UserRole.SUPER_ADMIN;
    if (!isSuperAdmin)
        throw new api_error_1.default(http_status_codes_1.StatusCodes.UNAUTHORIZED, "You are not authorized!");
    const result = yield prisma_1.default.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        yield tx.payment.deleteMany({
            where: {
                orderId
            }
        });
        yield tx.orderItem.deleteMany({
            where: {
                orderId
            }
        });
        const deletedOrder = yield tx.order.delete({
            where: {
                id: orderId
            }
        });
        return deletedOrder;
    }));
    return result;
});
exports.OrderServices = {
    createOrderIntoDB,
    getAllOrdersFromDb,
    getVendorAllOrdersFromDb,
    getCustomerAllPurchasesFromDb,
    getSingleOrderFromDb,
    updateOrderShippingDetailsIntoDb,
    deleteOrderFromDb
};
