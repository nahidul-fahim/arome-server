import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { UploadApiResponse } from 'cloudinary';
import config from '../config';

// Configuration
cloudinary.config({
    cloud_name: config.cloudinary.cloudinary_cloud_name,
    api_key: config.cloudinary.cloudinary_api_key,
    api_secret: config.cloudinary.cloudinary_secret_key
});

// Multer memory storage
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const sendImageToCloudinary = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.file) {
        return next();
    }

    try {
        // Convert buffer to Base64
        const base64Image = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;

        // Upload image to Cloudinary
        const uploadedImage: UploadApiResponse = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            public_id: `${Date.now()}-${req.file.originalname}`,
            folder: 'Arome',
        });

        // Attach the Cloudinary response to the request object
        req.cloudinaryResult = uploadedImage;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
};