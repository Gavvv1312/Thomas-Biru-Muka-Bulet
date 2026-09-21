"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponse = successResponse;
exports.errorResponse = errorResponse;
function successResponse(data, message = 'Success') {
    return {
        success: true,
        data,
        message,
    };
}
function errorResponse(message) {
    return {
        success: false,
        data: null,
        message,
    };
}
//# sourceMappingURL=response.js.map