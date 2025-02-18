import { UserRole, UserStatus } from "@prisma/client";
import { validateUser } from "../../../utils/validate-user";
import { IShop } from "./shop.interface";
import prisma from "../../../shared/prisma";
import ApiError from "../../../errors/api-error";
import { StatusCodes } from "http-status-codes";

const createNewShopIntoDb = async (data: IShop, cloudinaryResult: any) => {
    const vendor = await validateUser(data.vendorId, UserStatus.ACTIVE, [UserRole.VENDOR]);
    const hasExistingShop = await prisma.shop.findFirst({
        where: {
            vendorId: vendor.id
        }
    });
    if (hasExistingShop) throw new ApiError(StatusCodes.BAD_REQUEST, "You already have a shop!");
    const shopData: IShop = { ...data }
    if (cloudinaryResult && cloudinaryResult.secure_url) {
        shopData.logo = cloudinaryResult.secure_url;
    };
    const result = await prisma.shop.create({
        data: shopData
    });
    return result;
};

const getVendorShopFromDb = async (vendorId: string, userId: string) => {
    const vendor = await validateUser(vendorId, UserStatus.ACTIVE, [UserRole.VENDOR]);
    const shop = await prisma.shop.findFirst({
        where: {
            vendorId: vendor.id
        },
        include: {
            vendor: true,
        }
    });
    const currentUser = await validateUser(userId, UserStatus.ACTIVE, [UserRole.VENDOR, UserRole.ADMIN, UserRole.SUPER_ADMIN]);
    const isAdmin = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.SUPER_ADMIN;
    const isAuthorized = shop?.vendorId === userId || isAdmin;
    if (!isAuthorized) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!");
    return shop;
}

const updateShopIntoDb = async (id: string, data: IShop, cloudinaryResult: any) => {
    
}

export const ShopServices = {
    createNewShopIntoDb,
    getVendorShopFromDb
}