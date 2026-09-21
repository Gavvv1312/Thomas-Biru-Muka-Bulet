"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dropOffController = void 0;
const dropOffService_1 = require("../services/dropOffService");
const response_1 = require("../utils/response");
exports.dropOffController = {
    getDropOffPoints: async (req, res) => {
        const { tipe, partner_id } = req.query;
        const points = await dropOffService_1.dropOffService.getDropOffPoints({
            tipe: tipe,
            partnerId: partner_id,
        });
        res.json((0, response_1.successResponse)(points, 'Daftar drop-off point berhasil diambil'));
    },
    createDropOffPoint: async (req, res) => {
        const point = await dropOffService_1.dropOffService.createDropOffPoint(req.user.userId, req.body);
        res.status(201).json((0, response_1.successResponse)(point, 'Drop-off point berhasil dibuat'));
    },
    updateDropOffPoint: async (req, res) => {
        const point = await dropOffService_1.dropOffService.updateDropOffPoint(req.params.id, req.user.userId, req.body);
        res.json((0, response_1.successResponse)(point, 'Drop-off point berhasil diperbarui'));
    },
    deleteDropOffPoint: async (req, res) => {
        const result = await dropOffService_1.dropOffService.deleteDropOffPoint(req.params.id, req.user.userId);
        res.json((0, response_1.successResponse)(result, 'Drop-off point berhasil dihapus'));
    },
};
//# sourceMappingURL=dropOffController.js.map