// server/src/api/ai/search.ts
export const aiRoomSearch = async (req: Request, res: Response) => {
  const { query } = req.body;
  
  // Use OpenAI to extract 'intent' from the natural language string
  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [{ 
      role: "system", 
      content: "Extract filters (type, amenities, maxPrice) from this query into JSON format." 
    }, { role: "user", content: query }]
  });

  const filters = JSON.parse(completion.choices[0].message.content);
  const rooms = await Room.find({ 
    type: filters.type, 
    amenities: { $all: filters.amenities } 
  });
  
  res.json(rooms);
};