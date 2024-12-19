import bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import { UserRole } from '@prisma/client';
import { jwtHelpers } from '../../../helpers/jwt-helpers';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';

// create admin
const createNewAdminIntoDb = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newAdmin = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: UserRole.ADMIN,
      }
    })
    const admin = await tx.admin.create({
      data: {
        name: data.name,
        email: data.email,
        userId: newUser.id
      }
    })
    return admin;
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: newAdmin.userId,
      email: newAdmin.email,
      role: UserRole.ADMIN,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: newAdmin.userId,
      email: newAdmin.email,
      role: UserRole.ADMIN,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    newAdmin
  };
}

// create new customer
const createNewCustomerIntoDb = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newCustomer = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
      }
    })
    const customer = await tx.customer.create({
      data: {
        name: data.name,
        email: data.email,
        userId: newUser.id
      }
    })
    return customer;
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: newCustomer.userId,
      email: newCustomer.email,
      role: UserRole.CUSTOMER,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: newCustomer.userId,
      email: newCustomer.email,
      role: UserRole.CUSTOMER,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    newCustomer
  };
};


// create new vendor
const createNewVendorIntoDb = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newVendor = await prisma.$transaction(async (tx) => {
    const newUser = await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      }
    })
    const vendor = await tx.vendor.create({
      data: {
        shopName: data.shopName,
        email: data.email,
        userId: newUser.id,
        logo: data.logo,
        description: data.description,
      }
    })
    return vendor;
  })

  const accessToken = jwtHelpers.generateToken(
    {
      id: newVendor.userId,
      email: newVendor.email,
      role: UserRole.VENDOR,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.jwt_expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    {
      id: newVendor.userId,
      email: newVendor.email,
      role: UserRole.VENDOR,
    },
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    newVendor
  };
};


export const UserService = {
  createNewAdminIntoDb,
  createNewCustomerIntoDb,
  createNewVendorIntoDb
}