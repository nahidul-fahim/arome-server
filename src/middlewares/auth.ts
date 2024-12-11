import { NextFunction, Request, Response } from "express";
import { Secret } from "jsonwebtoken";
import { StatusCodes } from 'http-status-codes';
import ApiError from "../errors/api-error";
import { jwtHelpers } from "../helpers/jwt-helpers";
import config from "../config";

const auth = (...roles: string[]) => {
  return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  try {
      const token = req.headers.authorization

      if (!token) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "You are not authorized!")
      }

      const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret)

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(StatusCodes.FORBIDDEN, "Forbidden!")
      }
      next()
    }
    catch (err) {
      next(err)
    }
  }
};

export default auth;