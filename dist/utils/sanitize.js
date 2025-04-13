"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.excludeSensitiveFields = void 0;
const excludeSensitiveFields = (data, fieldsToExclude) => {
    const sanitizedData = Object.assign({}, data);
    fieldsToExclude.forEach((field) => {
        delete sanitizedData[field];
    });
    Object.keys(sanitizedData);
    return sanitizedData;
};
exports.excludeSensitiveFields = excludeSensitiveFields;
