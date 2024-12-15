"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendImageToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const config_1 = __importDefault(require("../config"));
// Configuration
cloudinary_1.v2.config({
    cloud_name: config_1.default.cloudinary.cloudinary_cloud_name,
    api_key: config_1.default.cloudinary.cloudinary_api_key,
    api_secret: config_1.default.cloudinary.cloudinary_secret_key
});
// Multer memory storage
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage: storage });
const sendImageToCloudinary = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return next();
    }
    try {
        // Convert buffer to Base64
        const base64Image = req.file.buffer.toString('base64');
        const dataURI = `data:${req.file.mimetype};base64,${base64Image}`;
        // Upload image to Cloudinary
        const uploadedImage = yield cloudinary_1.v2.uploader.upload(dataURI, {
            resource_type: 'auto',
            public_id: `${Date.now()}-${req.file.originalname}`,
            folder: 'Arome',
        });
        // Attach the Cloudinary response to the request object
        req.cloudinaryResult = uploadedImage;
        next();
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
});
exports.sendImageToCloudinary = sendImageToCloudinary;
