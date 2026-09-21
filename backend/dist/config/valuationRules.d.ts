export interface ValuationRules {
    condition_factors: Record<string, number>;
    age_depreciation_per_year: number;
    max_age_depreciation: number;
    range_margin: number;
    recycle_points_per_100g: number;
    component_base_values: Record<string, Record<string, number>>;
}
export declare function loadValuationRules(): ValuationRules;
export declare function getConditionFactor(condition: string): number;
export declare function getComponentBaseValue(category: string, componentName: string): number;
export declare function getAgeDepreciationPerYear(): number;
export declare function getMaxAgeDepreciation(): number;
export declare function getRangeMargin(): number;
export declare function getRecyclePointsPer100g(): number;
//# sourceMappingURL=valuationRules.d.ts.map