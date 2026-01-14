import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Booking from '../models/Booking';
import Room from '../models/Room';
import { PricingService } from '../services/PricingService';

export const createBooking = async (req: Request, res: Response) => {
  // Start a Transaction (Enterprise Standard)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { roomId, checkIn, checkOut, guestNotes } = req.body;
    const userId = req.user.id; // From Auth Middleware

    // 1. Check Room Availability & Fetch Latest Data
    const room = await Room.findById(roomId).session(session);
    if (!room) throw new Error("Room not found");

    // 2. Validate Dates (Overlap Check)
    const isBooked = room.bookedDates.some(dateRange => {
      return (new Date(checkIn) < dateRange.to && new Date(checkOut) > dateRange.from);
    });

    if (isBooked) {
      return res.status(400).json({ message: "Room is already reserved for these dates" });
    }

    // 3. AI Price Verification
    // Recalculate on the fly to prevent 'stale' prices from the frontend
    const occupancy = await calculateCurrentOccupancy(room._id); 
    const finalPrice = PricingService.calculateDynamicRate(room.basePrice, occupancy);

    // 4. Create the Booking Document
    const newBooking = new Booking({
      guest: userId,
      rooms: [roomId],
      checkIn,
      checkOut,
      pricing: {
        baseRate: room.basePrice,
        aiSurge: finalPrice - room.basePrice,
        totalAmount: finalPrice,
      },
      metadata: { guestNotes, source: 'web' },
      auditTrail: [{ action: 'BOOKING_CREATED', actor: userId }]
    });

    await newBooking.save({ session });

    // 5. Update Room's Occupancy Schedule
    room.bookedDates.push({
      from: new Date(checkIn),
      to: new Date(checkOut),
      bookingId: newBooking._id
    });
    await room.save({ session });

    // Commit Transaction
    await session.commitTransaction();
    
    res.status(201).json({ success: true, data: newBooking });

  } catch (error: any) {
    // If anything fails, abort and undo all DB changes automatically
    await session.abortTransaction();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};