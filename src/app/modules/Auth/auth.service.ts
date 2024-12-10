import { UserStatus } from "@prisma/client";
import prisma from "../../../shared/prisma";
import { excludeSensitiveFields } from "../../../utils/sanitize";
import bcrypt from "bcrypt";
import ApiError from "../../../errors/api-error";

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
  }

  const userWithoutSensitiveData = excludeSensitiveFields(userData, ["password"]);
  return userWithoutSensitiveData;
};

export const AuthServices = {
  loginUserIntoDb,
};
