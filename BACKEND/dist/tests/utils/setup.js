"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headersConToken = void 0;
const mockToken_1 = require("./mockToken");
const headersConToken = (payload = {}) => {
    const token = (0, mockToken_1.generarTokenMock)(payload);
    return {
        Authorization: `Bearer ${token}`,
    };
};
exports.headersConToken = headersConToken;
