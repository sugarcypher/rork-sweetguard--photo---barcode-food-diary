export const DAILY_SUGAR_LIMIT_GRAMS = 25; // WHO recommendation for adults
export const DAILY_SUGAR_LIMIT_TEASPOONS = DAILY_SUGAR_LIMIT_GRAMS / 4; // 1 teaspoon = ~4g of sugar

export const SUGAR_SEVERITY = {
  LOW: { threshold: 5, color: '#34C759' }, // 0-5g
  MEDIUM: { threshold: 15, color: '#FFCC00' }, // 5-15g
  HIGH: { threshold: 25, color: '#FF9500' }, // 15-25g
  VERY_HIGH: { threshold: Infinity, color: '#FF3B30' }, // >25g
};

export const getSugarSeverity = (sugarGrams: number) => {
  if (sugarGrams <= SUGAR_SEVERITY.LOW.threshold) return SUGAR_SEVERITY.LOW;
  if (sugarGrams <= SUGAR_SEVERITY.MEDIUM.threshold) return SUGAR_SEVERITY.MEDIUM;
  if (sugarGrams <= SUGAR_SEVERITY.HIGH.threshold) return SUGAR_SEVERITY.HIGH;
  return SUGAR_SEVERITY.VERY_HIGH;
};