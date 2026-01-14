import { Request, Response } from 'express';
import mongoose from 'mongoose';

// Access the model
const Room = mongoose.models.Room || mongoose.model('Room', new mongoose.Schema({}));

export const getAllRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find();
        res.status(200).json(rooms);
    } catch (error) {
        res.status(500).json({ message: "Error", error });
    }
};

export const simulateSpike = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find();
        const updatePromises = rooms.map(async (room: any) => {
            const spike = Math.random() * 0.2 + 0.1;
            const newDemand = Math.min(1, room.demandScore + spike);
            const calculatedPrice = Math.round(room.basePrice * (1 + (newDemand * 0.5)));
            room.demandScore = newDemand;
            room.currentPrice = calculatedPrice;
            return room.save();
        });
        await Promise.all(updatePromises);
        res.status(200).json({ message: "Prices Spiked" });
    } catch (error) {
        res.status(500).json({ message: "Sim failed" });
    }
};

// EXPORT THIS FUNCTION CLEARLY
export const resetMarket = async (req: Request, res: Response) => {
    try {
        const rooms = await Room.find();
        const updatePromises = rooms.map(async (room: any) => {
            room.demandScore = 0.5; // Reset to 50%
            room.currentPrice = room.basePrice; // Reset to original price
            return room.save();
        });
        await Promise.all(updatePromises);
        res.status(200).json({ message: "Market Reset" });
    } catch (error) {
        res.status(500).json({ message: "Reset failed" });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const newRoom = new Room(req.body);
        await newRoom.save();
        res.status(201).json(newRoom);
    } catch (error) {
        res.status(400).json({ error });
    }
};