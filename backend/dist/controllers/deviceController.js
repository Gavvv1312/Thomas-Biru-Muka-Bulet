"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deviceController = void 0;
const deviceService_1 = require("../services/deviceService");
const response_1 = require("../utils/response");
exports.deviceController = {
    createDevice: async (req, res) => {
        const device = await deviceService_1.deviceService.createDevice(req.user.userId, req.body);
        res.status(201).json((0, response_1.successResponse)(device, 'Device berhasil dibuat'));
    },
    getDeviceById: async (req, res) => {
        const device = await deviceService_1.deviceService.getDeviceById(req.params.id, req.user.userId, req.user.role);
        res.json((0, response_1.successResponse)(device, 'Device berhasil diambil'));
    },
    getMyDevices: async (req, res) => {
        const devices = await deviceService_1.deviceService.getDevicesByUser(req.user.userId);
        res.json((0, response_1.successResponse)(devices, 'Daftar device berhasil diambil'));
    },
    createValuation: async (req, res) => {
        const result = await deviceService_1.deviceService.createOrGetValuation(req.params.id, req.user.userId);
        res.json((0, response_1.successResponse)(result, 'Valuasi berhasil dihitung'));
    },
    getValuation: async (req, res) => {
        const result = await deviceService_1.deviceService.getValuation(req.params.id, req.user.userId);
        res.json((0, response_1.successResponse)(result, 'Valuasi berhasil diambil'));
    },
};
//# sourceMappingURL=deviceController.js.map