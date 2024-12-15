import { Prisma } from "@prisma/client";
import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";
import config from "../config";

const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    let success = false;
    let message = err.message || "Something went wrong!";
    let error = err;
    let stack = err.stack;

    if (err instanceof Prisma.PrismaClientValidationError) {
        message = 'Validation Error';
        error = err.message
        stack = config.env === 'development' ? err.stack : null
    }
    if (err instanceof ZodError){
        statusCode = StatusCodes.BAD_REQUEST;
        message = err.errors[0].message;
        error = err.errors;
        stack = config.env === 'development' ? err.stack : null
    }
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            message = "Duplicate Key error";
            error = err.meta;
            stack = config.env === 'development' ? err.stack : null
        }
        else if (err.code === 'P2025') {
            message = "No data found";
            statusCode = StatusCodes.NOT_FOUND;
            error = err.meta;
            stack = config.env === 'development' ? err.stack : null
        }
    }

    res.status(statusCode).json({
        success,
        message,
        error,
        stack
    })
};

export default globalErrorHandler;