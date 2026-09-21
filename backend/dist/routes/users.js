"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pointsController_1 = require("../controllers/pointsController");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
// GET /api/users/:id/points
router.get('/:id/points', (0, validate_1.validate)(schemas_1.idParamSchema), pointsController_1.pointsController.getPoints);
// GET /api/users/:id/points/history
router.get('/:id/points/history', (0, validate_1.validate)(schemas_1.idParamSchema), pointsController_1.pointsController.getPointsHistory);
// GET /api/users/:id/dashboard
router.get('/:id/dashboard', (0, validate_1.validate)(schemas_1.idParamSchema), dashboardController_1.dashboardController.getDashboard);
exports.default = router;
//# sourceMappingURL=users.js.map