import { StatusCodes } from "http-status-codes";
import ApiError from "../errors/api-error";
import prisma from "../shared/prisma"

export const validateProductInventory = async (productId: string, quantity: number) => {
    const product = await prisma.product.findUnique({
        where: {
            id: productId,
        }
    });
    if (!product) throw new ApiError(StatusCodes.NOT_FOUND, "Product not found!");
    if (product.inventory < quantity) throw new ApiError(400, `Insufficient inventory for product ${product.name}`);
    return product;
}