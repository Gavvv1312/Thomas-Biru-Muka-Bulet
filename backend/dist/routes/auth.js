"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.post('/register', (0, validate_1.validate)(schemas_1.registerSchema), authController_1.authController.register);
router.post('/login', (0, validate_1.validate)(schemas_1.loginSchema), authController_1.authController.login);
router.post('/refresh', (0, validate_1.validate)(schemas_1.refreshTokenSchema), authController_1.authController.refresh);
router.post('/logout', (0, validate_1.validate)(schemas_1.refreshTokenSchema), authController_1.authController.logout);
router.get('/me', auth_1.authenticate, authController_1.authController.me);
exports.default = router;
//# sourceMappingURL=auth.js.map