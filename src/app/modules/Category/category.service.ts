import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma";
import { ICategory } from "./category.interface";

const createCategoryIntoDb = async (data: ICategory) => {
  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: data.name,
        mode: 'insensitive'
      }
    }
  });

  if (existingCategory) {
    throw new ApiError(409, "Category already exists");
  }

  const result = await prisma.category.create({
    data: {
      name: data.name as string,
      description: data.description
    }
  });
  return result;
};

const getAllCategoriesFromDb = async () => {
  const result = await prisma.category.findMany();
  return result;
};

const getSingleCategoryFromDb = async (id: string) => {
  const result = await prisma.category.findUniqueOrThrow({
    where: {
      id
    }
  });
  return result;
}



export const CategoryServices = {
  createCategoryIntoDb,
  getAllCategoriesFromDb,
  getSingleCategoryFromDb
}
