// server/src/api/rooms/ai-sort.ts
export const getAISortedRooms = async (req: Request, res: Response) => {
  const rooms = await Room.find();
  
  const sortedRooms = rooms.sort((a, b) => {
    // AI Score: Combination of DemandScore and Price margin
    const scoreA = a.demandScore * a.currentPrice;
    const scoreB = b.demandScore * b.currentPrice;
    return scoreB - scoreA; // Highest potential profit first
  });

  res.json(sortedRooms);
};