"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadValuationRules = loadValuationRules;
exports.getConditionFactor = getConditionFactor;
exports.getComponentBaseValue = getComponentBaseValue;
exports.getAgeDepreciationPerYear = getAgeDepreciationPerYear;
exports.getMaxAgeDepreciation = getMaxAgeDepreciation;
exports.getRangeMargin = getRangeMargin;
exports.getRecyclePointsPer100g = getRecyclePointsPer100g;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let cachedRules = null;
function loadValuationRules() {
    if (cachedRules)
        return cachedRules;
    const rulesPath = path.resolve(process.cwd(), 'config', 'valuation_rules.json');
    const raw = fs.readFileSync(rulesPath, 'utf-8');
    cachedRules = JSON.parse(raw);
    return cachedRules;
}
function getConditionFactor(condition) {
    const rules = loadValuationRules();
    return rules.condition_factors[condition] ?? 0;
}
function getComponentBaseValue(category, componentName) {
    const rules = loadValuationRules();
    const categoryRules = rules.component_base_values[category.toLowerCase()];
    if (!categoryRules)
        return 0;
    return categoryRules[componentName.toLowerCase()] ?? 0;
}
function getAgeDepreciationPerYear() {
    return loadValuationRules().age_depreciation_per_year;
}
function getMaxAgeDepreciation() {
    return loadValuationRules().max_age_depreciation;
}
function getRangeMargin() {
    return loadValuationRules().range_margin;
}
function getRecyclePointsPer100g() {
    return loadValuationRules().recycle_points_per_100g;
}
//# sourceMappingURL=valuationRules.js.map