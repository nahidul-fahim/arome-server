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


export const ShopServices = {
    createNewShopIntoDb
}