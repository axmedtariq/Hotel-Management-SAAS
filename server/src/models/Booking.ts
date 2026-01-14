import mongoose, { Schema, Document } from 'mongoose';

// Interface for strong typing
export interface IBooking extends Document {
  guest: mongoose.Types.ObjectId;
  rooms: mongoose.Types.ObjectId[];
  checkIn: Date;
  checkOut: Date;
  pricing: {
    baseRate: number;
    aiSurge: number;      // Tracking the AI's influence on the price
    totalAmount: number;
    currency: string;
  };
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'refunded';
  metadata: {
    source: 'web' | 'mobile' | 'ai-concierge'; // Tracking where booking came from
    guestNotes: string;
    aiSentiment: number; // 0-1 score of guest satisfaction during booking
  };
  auditTrail: Array<{ action: string; timestamp: Date; actor: string }>;
}

const BookingSchema: Schema = new Schema({
  guest: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  rooms: [{ type: Schema.Types.ObjectId, ref: 'Room', required: true }],
  
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  
  pricing: {
    baseRate: { type: Number, required: true },
    aiSurge: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    currency: { type: String, default: 'USD' }
  },

  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'checked-in', 'checked-out', 'cancelled'],
    default: 'pending' 
  },

  paymentStatus: { 
    type: String, 
    enum: ['unpaid', 'partial', 'paid', 'refunded'],
    default: 'unpaid' 
  },

  metadata: {
    source: { type: String, enum: ['web', 'mobile', 'ai-concierge'], default: 'web' },
    guestNotes: { type: String },
    aiSentiment: { type: Number, min: 0, max: 1 } 
  },

  // Enterprise Security: Tracking every change to the booking
  auditTrail: [{
    action: String,
    timestamp: { type: Date, default: Date.now },
    actor: String // Stores 'System' or 'Admin_ID'
  }]
}, { 
  timestamps: true, // Automatically creates createdAt and updatedAt
  toJSON: { virtuals: true } 
});

// INDEXING for high-performance 2026 search
BookingSchema.index({ checkIn: 1, checkOut: 1 });
BookingSchema.index({ status: 1 });

export default mongoose.model<IBooking>('Booking', BookingSchema);