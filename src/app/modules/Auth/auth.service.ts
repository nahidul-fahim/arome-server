import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { excludeSensitiveFields } from "../../../utils/sanitize";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/api-error";
import { jwtHelpers } from "../../../helpers/jwt-helpers";
import config from "../../../config";
import { Secret } from "jsonwebtoken";

// login user into db
const loginUserIntoDb = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
      status: UserStatus.ACTIVE,
    },
  });

  const isCorrectPassword = await bcrypt.compare(payload.password, userData.password);
  if (!isCorrectPassword) {
    throw new ApiError(401, "Password is incorrect");
  };

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  const userWithoutSensitiveData = excludeSensitiveFields(userData, ["password"]);
  return {
    accessToken,
    refreshToken,
    userWithoutSensitiveData
  };
};

// refresh token
const refreshToken = async (token: string) => {
  let decodedData;
  try {
    decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
  }
  catch (err) {
    throw new ApiError(401, "You are not authorized!");
  }

  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: decodedData.email,
      status: UserStatus.ACTIVE
    }
  });

  const accessToken = jwtHelpers.generateToken({
    id: userData.id,
    email: userData.email,
    role: userData.role
  },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  return accessToken;
};

export const AuthServices = {
  loginUserIntoDb,
  refreshToken
};
