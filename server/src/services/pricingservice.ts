// server/src/services/PricingService.ts
export class PricingService {
  /**
   * AI-Driven Dynamic Pricing Logic
   * Factors: Base Price, Occupancy, Day of Week, AI Demand Score
   */
  static calculateDynamicRate(basePrice: number, occupancyRate: number): number {
    let multiplier = 1.0;

    // Increase price if occupancy is high (> 80%)
    if (occupancyRate > 0.8) multiplier += 0.25;
    
    // Weekend surge
    const isWeekend = new Date().getDay() % 6 === 0;
    if (isWeekend) multiplier += 0.15;

    // Apply 2026 AI Variance (Mock AI logic)
    const aiVariance = Math.random() * (1.1 - 0.9) + 0.9; 

    return Math.round(basePrice * multiplier * aiVariance);
  }
}