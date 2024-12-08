import bcrypt from 'bcrypt';
import prisma from "../../../shared/prisma";
import { UserRole } from '@prisma/client';

const createNewCustomerIntoDb = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
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
      }
    })
    return customer;
  });
  return result;
};


// create new vendor
const createNewVendorIntoDb = async (data: any) => {
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const result = await prisma.$transaction(async (tx) => {
    await tx.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        role: UserRole.VENDOR,
      }
    })
    const vendor = await tx.vendor.create({
      data: {
        shopName: data.shopName,
        userId: data.userId,
        email: data.email,
        logo: data.logo,
        description: data.description,
      }
    })
    return vendor;
  })
  return result;
};


export const UserService = {
  createNewCustomerIntoDb,
  createNewVendorIntoDb
}