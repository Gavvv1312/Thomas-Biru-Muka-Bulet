import * as fs from 'fs';
import * as path from 'path';

export interface ValuationRules {
  condition_factors: Record<string, number>;
  age_depreciation_per_year: number;
  max_age_depreciation: number;
  range_margin: number;
  recycle_points_per_100g: number;
  component_base_values: Record<string, Record<string, number>>;
}

let cachedRules: ValuationRules | null = null;

export function loadValuationRules(): ValuationRules {
  if (cachedRules) return cachedRules;

  const rulesPath = path.resolve(process.cwd(), 'config', 'valuation_rules.json');
  const raw = fs.readFileSync(rulesPath, 'utf-8');
  cachedRules = JSON.parse(raw) as ValuationRules;
  return cachedRules;
}

export function getConditionFactor(condition: string): number {
  const rules = loadValuationRules();
  return rules.condition_factors[condition] ?? 0;
}

export function getComponentBaseValue(category: string, componentName: string): number {
  const rules = loadValuationRules();
  const categoryRules = rules.component_base_values[category.toLowerCase()];
  if (!categoryRules) return 0;
  return categoryRules[componentName.toLowerCase()] ?? 0;
}

export function getAgeDepreciationPerYear(): number {
  return loadValuationRules().age_depreciation_per_year;
}

export function getMaxAgeDepreciation(): number {
  return loadValuationRules().max_age_depreciation;
}

export function getRangeMargin(): number {
  return loadValuationRules().range_margin;
}

export function getRecyclePointsPer100g(): number {
  return loadValuationRules().recycle_points_per_100g;
}