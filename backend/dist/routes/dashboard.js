"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.get('/:id', auth_1.authenticate, (0, validate_1.validate)(schemas_1.idParamSchema), dashboardController_1.dashboardController.getDashboard);
exports.default = router;
//# sourceMappingURL=dashboard.js.map