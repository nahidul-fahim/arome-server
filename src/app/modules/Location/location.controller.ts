import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../shared/catch-async";
import sendResponse from "../../../shared/send-response";
import { LocationServices } from "./location.service";


const getAllRegions = catchAsync(async (req, res) => {
    const result = await LocationServices.getAllRegionsFromDb();
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Regions fetched successfully!",
        data: result
    })
})

const getAllDistricts = catchAsync(async (req, res) => {
    const { regionId } = req.query;
    const result = await LocationServices.getAllDistrictsFromDb(regionId as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Districts fetched successfully!",
        data: result
    })
})

const getAllCities = catchAsync(async (req, res) => {
    const { districtId } = req.query;
    const result = await LocationServices.getAllCitiesFromDb(districtId as string);
    sendResponse(res, {
        statusCode: StatusCodes.OK,
        success: true,
        message: "Cities fetched successfully!",
        data: result
    })
})

export const LocationController = {
    getAllRegions,
    getAllDistricts,
    getAllCities
}