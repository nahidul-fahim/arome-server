import { UserRole } from "@prisma/client";
import ApiError from "../errors/api-error";
import { StatusCodes } from "http-status-codes";

export const validateAuthorized = async (currentUserId: string, currentUserRole: UserRole, userId: string) => {
    const isAuthorized = currentUserId === userId || currentUserRole === UserRole.ADMIN || currentUserRole === UserRole.SUPER_ADMIN
    if (!isAuthorized) throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!")
    return isAuthorized;
}