import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

// 1. Define the Schema directly inside the seed file to avoid the import error
const roomSchema = new mongoose.Schema({
  name: String,
  basePrice: Number,
  currentPrice: Number,
  priceHistory: [{
    price: Number,
    reason: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  demandScore: { type: Number, default: 0.5 }
});

// Create the Model
const Room = mongoose.models.Room || mongoose.model('Room', roomSchema);

const seedRooms = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/luxeai_hotel';
    
    console.log("Connecting to:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Connected to DB...");

    // 2. Clear existing data
    await Room.deleteMany({});

    // 3. Your professional room data
    const rooms = [
      {
        name: "Grand Presidential Suite",
        basePrice: 1200,
        currentPrice: 1450,
        demandScore: 0.85,
        priceHistory: [
            { price: 1200, reason: "Opening Rate" }, 
            { price: 1450, reason: "High Demand Surge" }
        ]
      },
      {
        name: "Ocean View Deluxe",
        basePrice: 450,
        currentPrice: 450,
        demandScore: 0.42,
        priceHistory: [
            { price: 450, reason: "Standard Rate" }
        ]
      },
      {
        name: "Executive Business Room",
        basePrice: 300,
        currentPrice: 330,
        demandScore: 0.65,
        priceHistory: [
            { price: 300, reason: "Base" }, 
            { price: 330, reason: "Weekday Peak" }
        ]
      }
    ];

    await Room.insertMany(rooms);
    console.log("✅ SUCCESS: Database Seeded with 3 Rooms!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding Error:", error);
    process.exit(1);
  }
};

seedRooms();