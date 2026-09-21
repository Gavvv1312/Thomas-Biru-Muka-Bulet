"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dropOffController_1 = require("../controllers/dropOffController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
// GET is public for partners, but let's keep it authenticated
router.get('/', auth_1.authenticate, dropOffController_1.dropOffController.getDropOffPoints);
// POST only for partner creating their own location
router.post('/', auth_1.authenticate, (0, validate_1.validate)(schemas_1.dropOffPointCreateSchema), dropOffController_1.dropOffController.createDropOffPoint);
// PATCH/DELETE for partner who owns the location
router.patch('/:id', auth_1.authenticate, (0, validate_1.validate)(schemas_1.idParamSchema), dropOffController_1.dropOffController.updateDropOffPoint);
router.delete('/:id', auth_1.authenticate, (0, validate_1.validate)(schemas_1.idParamSchema), dropOffController_1.dropOffController.deleteDropOffPoint);
exports.default = router;
//# sourceMappingURL=dropoff.js.map