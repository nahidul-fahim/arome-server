import bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import { UserRole } from '@prisma/client';
import { jwtHelpers } from '../../../helpers/jwt-helpers';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import { IVendor } from '../Vendor/vendor.interface';
import { excludeSensitiveFields } from '../../../utils/sanitize';

// create admin
const createNewAdminIntoDb = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newAdmin = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      }
    })
    await tx.admin.create({
      data: {
        name: data.name,
        userId: newUser.id
      }
    })
    return newUser;
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: newAdmin.id,
      email: newAdmin.email,
      role: UserRole.ADMIN,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: newAdmin.id,
      email: newAdmin.email,
      role: UserRole.ADMIN,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );
  const result = excludeSensitiveFields(newAdmin, ["password"]);
  return {
    accessToken,
    refreshToken,
    result
  };
}

// create new customer
const createNewCustomerIntoDb = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newCustomer = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      }
    })
    await tx.customer.create({
      data: {
        name: data.name,
        userId: newUser.id
      }
    })
    return newUser;
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: newCustomer.id,
      email: newCustomer.email,
      role: UserRole.CUSTOMER,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: newCustomer.id,
      email: newCustomer.email,
      role: UserRole.CUSTOMER,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );
  const result = excludeSensitiveFields(newCustomer, ["password"]);
  return {
    accessToken,
    refreshToken,
    result
  };
};


// create new vendor
const createNewVendorIntoDb = async (data: IVendor) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newVendor = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      }
    })
    await tx.vendor.create({
      data: {
        name: data.name,
        userId: newUser.id
      }
    })
    return newUser;
  })

  const accessToken = jwtHelpers.generateToken(
    {
      id: newVendor.id,
      email: newVendor.email,
      role: UserRole.VENDOR,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: newVendor.id,
      email: newVendor.email,
      role: UserRole.VENDOR,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  const result = excludeSensitiveFields(newVendor, ["password"]);

  return {
    accessToken,
    refreshToken,
    result
  };
};


export const UserService = {
  createNewAdminIntoDb,
  createNewCustomerIntoDb,
  createNewVendorIntoDb
}