import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/api-error";
import prisma from "../../../shared/prisma";

const getAllRegionsFromDb = async () => {
    const result = await prisma.region.findMany({
        orderBy: {
            name: 'asc'
        }
    });
    return result;
}

const getAllDistrictsFromDb = async (regionId: string) => {
    if(!regionId) throw new ApiError(StatusCodes.BAD_REQUEST, "Region id is required!");
    const result = await prisma.district.findMany({
        where: {
            regionId
        },
        orderBy: {
            name: 'asc'
        }
    });
    return result;
}

const getAllCitiesFromDb = async (districtId: string) => {
    if(!districtId) throw new ApiError(StatusCodes.BAD_REQUEST, "District id is required!");
    const result = await prisma.city.findMany({
        where: {
            districtId
        },
        orderBy: {
            name: 'asc'
        }
    });
    return result;
}

export const LocationServices = {
    getAllRegionsFromDb,
    getAllDistrictsFromDb,
    getAllCitiesFromDb
}