"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSelectFields = void 0;
exports.userSelectFields = {
    Admin: {
        select: {
            id: true,
            name: true,
            profilePhoto: true,
        },
    },
    Vendor: {
        select: {
            id: true,
            shopName: true,
            isBlacklisted: true,
            logo: true,
            description: true,
        },
    },
    Customer: {
        select: {
            id: true,
            name: true,
            profilePhoto: true,
        },
    },
};
