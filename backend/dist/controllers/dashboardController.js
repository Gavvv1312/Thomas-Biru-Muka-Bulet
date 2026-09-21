"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardController = void 0;
const dashboardService_1 = require("../services/dashboardService");
const response_1 = require("../utils/response");
exports.dashboardController = {
    getDashboard: async (req, res) => {
        const dashboard = await dashboardService_1.dashboardService.getUserDashboard(req.params.id, req.user.userId, req.user.role);
        res.json((0, response_1.successResponse)(dashboard, 'Dashboard berhasil diambil'));
    },
};
//# sourceMappingURL=dashboardController.js.map