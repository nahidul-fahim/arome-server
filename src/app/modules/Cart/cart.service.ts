import prisma from "../../../shared/prisma";


const createCartIntoDb = async (data: any) => {
    const result = await prisma.cart.create({
        data
    });
    return result;
}