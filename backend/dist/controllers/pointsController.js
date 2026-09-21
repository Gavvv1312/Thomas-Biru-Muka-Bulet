"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pointsController = void 0;
const pointsService_1 = require("../services/pointsService");
const response_1 = require("../utils/response");
exports.pointsController = {
    getPoints: async (req, res) => {
        const targetUserId = req.params.id;
        const result = await pointsService_1.pointsService.getUserPoints(targetUserId, req.user.userId, req.user.role);
        res.json((0, response_1.successResponse)(result, 'Poin berhasil diambil'));
    },
    getPointsHistory: async (req, res) => {
        const targetUserId = req.params.id;
        const history = await pointsService_1.pointsService.getPointsHistory(targetUserId, req.user.userId, req.user.role);
        res.json((0, response_1.successResponse)(history, 'Riwayat poin berhasil diambil'));
    },
};
//# sourceMappingURL=pointsController.js.map