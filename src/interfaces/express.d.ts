import { UploadApiResponse } from "cloudinary";
import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string,
        email: string,
        role: string,
        iat: number,
        exp: number
      };
      cloudinaryResult?: UploadApiResponse;
    }
  }
}
