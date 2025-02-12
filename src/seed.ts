import { StatusCodes } from "http-status-codes";
import { allCity, allDistrict, allRegion } from "../src/data/geolocation-data";
import ApiError from "../src/errors/api-error";
import prisma from "../src/shared/prisma";

async function seedMain() {
    const createdRegions = await Promise.all(
        allRegion.map(async (region) => {
            return await prisma.region.upsert({
                where: { name: region.name },
                update: {},
                create: { name: region.name }
            });
        })
    )

    const createdDistricts = await Promise.all(
        allDistrict.map(async (district) => {
            const region = createdRegions.find(r => r.name === district.region_name);
            if (!region) throw new ApiError(StatusCodes.NOT_FOUND, `Region ${district.region_name} not found!`);
            return await prisma.district.upsert({
                where: { name: district.name },
                update: {},
                create: { name: district.name, regionId: region.id },
            });
        })
    )

    await Promise.all(
        allCity.map(async (city) => {
            const district = createdDistricts.find(d => d.name === city.district_name);
            if (!district) throw new ApiError(StatusCodes.NOT_FOUND, `District ${city.district_name} not found!`);
            return await prisma.city.upsert({
                where: { name: city.name },
                update: {},
                create: { name: city.name, districtId: district.id },
            });
        })
    )
}

seedMain()
    .catch(error => {
        console.error("Error during seeding:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });