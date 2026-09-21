"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const errorHandler_1 = require("./middlewares/errorHandler");
const response_1 = require("./utils/response");
const auth_1 = __importDefault(require("./routes/auth"));
const devices_1 = __importDefault(require("./routes/devices"));
const transactions_1 = __importDefault(require("./routes/transactions"));
const users_1 = __importDefault(require("./routes/users"));
const dropoff_1 = __importDefault(require("./routes/dropoff"));
const swagger_1 = require("./docs/swagger");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: config_1.config.corsOrigin }));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check
app.get('/api/health', (req, res) => {
    res.json((0, response_1.successResponse)({ status: 'ok', timestamp: new Date().toISOString() }, 'Server aktif'));
});
// Swagger
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpec));
// API routes
app.use('/api/auth', auth_1.default);
app.use('/api/devices', devices_1.default);
app.use('/api/transactions', transactions_1.default);
app.use('/api/users', users_1.default);
app.use('/api/dropoff-points', dropoff_1.default);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map