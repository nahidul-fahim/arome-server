import { UserRole, UserStatus } from "@prisma/client";
import prisma from "../shared/prisma";
import ApiError from "../errors/api-error";
import { StatusCodes } from "http-status-codes";

export const validateUser = async (userId: string, status: UserStatus, roles: UserRole[]) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
            status,
            role: { in: roles },
            isDeleted: false
        }
    });
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, `Invalid user: ${userId}`);
    return user;
}