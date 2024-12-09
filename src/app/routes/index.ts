import express from "express";
import { userRoutes } from "../modules/User/user.route";
import { AuthRoutes } from "../modules/Auth/auth.routes";
import { vendorRoutes } from "../modules/Vendor/vendor.route";
import { customerRoutes } from "../modules/Customer/customer.route";

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
];

moduleRoutes.forEach(route => {
    router.use(route.path, route.route);
});

export default router;