import express from "express";
import { LocationController } from "./location.controller";

const router = express.Router();

router.get(
    "/region",
    LocationController.getAllRegions
)
router.get(
    "/district",
    LocationController.getAllDistricts
)
router.get(
    "/city",
    LocationController.getAllCities
)


export const locationRoutes = router;