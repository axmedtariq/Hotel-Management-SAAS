// server/src/services/AutomationService.ts
export const syncAIRates = async () => {
  const rooms = await Room.find();
  for (let room of rooms) {
    const occupancy = await calculateOccupancy(room._id);
    const newRate = PricingService.calculateDynamicRate(room.basePrice, occupancy);
    
    room.currentPrice = newRate;
    room.priceHistory.push({ price: newRate, reason: "AI Daily Optimization" });
    await room.save();
  }
};
// PRO TIP: Run this daily using 'node-cron'