"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const deviceController_1 = require("../controllers/deviceController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', (0, validate_1.validate)(schemas_1.deviceCreateSchema), deviceController_1.deviceController.createDevice);
router.get('/', deviceController_1.deviceController.getMyDevices);
router.get('/:id', (0, validate_1.validate)(schemas_1.idParamSchema), deviceController_1.deviceController.getDeviceById);
router.post('/:id/valuation', (0, validate_1.validate)(schemas_1.idParamSchema), deviceController_1.deviceController.createValuation);
router.get('/:id/valuation', (0, validate_1.validate)(schemas_1.idParamSchema), deviceController_1.deviceController.getValuation);
exports.default = router;
//# sourceMappingURL=devices.js.map