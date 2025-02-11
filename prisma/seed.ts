import { allRegion } from "../src/data/geolocation-data";
import prisma from "../src/shared/prisma";

async function seedMain() {
    for(const region of allRegion) {
        await prisma.region.create()
    }
}