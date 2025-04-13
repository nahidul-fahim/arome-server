"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("../modules/User/user.route");
const auth_routes_1 = require("../modules/Auth/auth.routes");
const vendor_route_1 = require("../modules/Vendor/vendor.route");
const customer_route_1 = require("../modules/Customer/customer.route");
const admin_route_1 = require("../modules/Admin/admin.route");
const category_route_1 = require("../modules/Category/category.route");
const product_route_1 = require("../modules/Product/product.route");
const order_route_1 = require("../modules/Order/order.route");
const cart_route_1 = require("../modules/Cart/cart.route");
const location_route_1 = require("../modules/Location/location.route");
const shope_route_1 = require("../modules/Shop/shope.route");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/user",
        route: user_route_1.userRoutes
    },
    {
        path: "/auth",
        route: auth_routes_1.AuthRoutes
    },
    {
        path: "/vendor",
        route: vendor_route_1.vendorRoutes
    },
    {
        path: "/customer",
        route: customer_route_1.customerRoutes
    },
    {
        path: "/admin",
        route: admin_route_1.adminRoutes
    },
    {
        path: "/category",
        route: category_route_1.categoryRoutes
    },
    {
        path: "/product",
        route: product_route_1.productRoutes
    },
    {
        path: "/cart",
        route: cart_route_1.cartRoutes
    },
    {
        path: "/order",
        route: order_route_1.orderRoutes
    },
    {
        path: "/location",
        route: location_route_1.locationRoutes
    },
    {
        path: "/shop",
        route: shope_route_1.shopRoutes
    },
];
moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});
exports.default = router;
