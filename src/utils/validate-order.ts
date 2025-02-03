import prisma from "../shared/prisma";
import ApiError from "../errors/api-error";
import { StatusCodes } from "http-status-codes";

export const validateOrder = async (orderId: string) => {
    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        }
    });
    if (!order) throw new ApiError(StatusCodes.NOT_FOUND, `Invalid order: ${orderId}`);
    return order;
}