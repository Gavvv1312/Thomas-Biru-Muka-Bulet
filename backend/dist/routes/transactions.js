"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const transactionController_1 = require("../controllers/transactionController");
const auth_1 = require("../middlewares/auth");
const validate_1 = require("../middlewares/validate");
const schemas_1 = require("../validators/schemas");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/', (0, validate_1.validate)(schemas_1.transactionCreateSchema), transactionController_1.transactionController.createTransaction);
router.get('/', transactionController_1.transactionController.getTransactions);
router.get('/:id', (0, validate_1.validate)(schemas_1.idParamSchema), transactionController_1.transactionController.getTransactionById);
router.patch('/:id/offer', (0, validate_1.validate)(schemas_1.idParamSchema), (0, validate_1.validate)(schemas_1.technicianOfferSchema), transactionController_1.transactionController.makeOffer);
router.patch('/:id/verify', (0, validate_1.validate)(schemas_1.idParamSchema), (0, validate_1.validate)(schemas_1.verificationSchema), transactionController_1.transactionController.verify);
router.patch('/:id/complete', transactionController_1.transactionController.complete);
router.patch('/:id/cancel', (0, validate_1.validate)(schemas_1.idParamSchema), transactionController_1.transactionController.cancel);
exports.default = router;
//# sourceMappingURL=transactions.js.map