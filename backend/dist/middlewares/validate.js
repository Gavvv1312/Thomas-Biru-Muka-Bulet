"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
const validate = (schema) => async (req, res, next) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        next();
    }
    catch (error) {
        if (error instanceof zod_1.ZodError) {
            const messages = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
            throw new errors_1.BadRequestError(messages);
        }
        next(error);
    }
};
exports.validate = validate;
//# sourceMappingURL=validate.js.map