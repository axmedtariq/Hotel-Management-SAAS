import mongoose, { Schema, Document } from 'mongoose';

// 1. Create a TypeScript interface so your code knows exactly what a "Room" looks like
export interface IRoom extends Document {
  name: string;
  basePrice: number;
  currentPrice: number;
  priceHistory: Array<{
    price: number;
    reason: string;
    updatedAt: Date;
  }>;
  demandScore: number;
}

// 2. Define the Schema
const roomSchema = new Schema<IRoom>({
  name: { type: String, required: true },
  basePrice: { type: Number, required: true },
  currentPrice: { type: Number, required: true },
  priceHistory: [{
    price: Number,
    reason: String,
    updatedAt: { type: Date, default: Date.now }
  }],
  demandScore: { type: Number, default: 0.5 } 
}, { 
  timestamps: true // This automatically adds 'createdAt' and 'updatedAt' for the room itself
});

// 3. EXPORT the model
const Room = mongoose.model<IRoom>('Room', roomSchema);
export default Room;