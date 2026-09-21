"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pointsController_1 = require("../controllers/pointsController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/:id', (0, validate_1.validate)(schemas_1.idParamSchema), pointsController_1.pointsController.getPoints);
router.get('/:id/history', (0, validate_1.validate)(schemas_1.idParamSchema), pointsController_1.pointsController.getPointsHistory);
exports.default = router;
//# sourceMappingURL=points.js.map