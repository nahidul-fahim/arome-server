import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { vendorRoutes } from "../modules/Vendor/vendor.route";
import { customerRoutes } from "../modules/Customer/customer.route";
import { adminRoutes } from "../modules/Admin/admin.route";
import { categoryRoutes } from "../modules/Category/category.route";
import { productRoutes } from "../modules/Product/product.route";
import { orderRoutes } from "../modules/Order/order.route";
import { cartRoutes } from "../modules/Cart/cart.route";

const router = express.Router();

const moduleRoutes = [
    {
        path: "/user",
        route: userRoutes
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/vendor",
        route: vendorRoutes
    },
    {
        path: "/customer",
        route: customerRoutes
    },
    {
        path: "/admin",
        route: adminRoutes
    },
    {
        path: "/category",
        route: categoryRoutes
    },
    {
        path: "/product",
        route: productRoutes
    },
    {
        path: "/cart",
        route: cartRoutes
    },
    {
        path: "/order",
        route: orderRoutes
    },
];

moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});

export default router;