// client/src/store/useBookingStore.ts
import { create } from 'zustand';

interface BookingState {
  selectedRoom: any | null;
  checkIn: Date | null;
  checkOut: Date | null;
  dynamicPrice: number;
  setRoom: (room: any) => void;
  updatePrice: (newPrice: number) => void;
}

export const useBookingStore = create<BookingState>((set) => ({
  selectedRoom: null,
  checkIn: null,
  checkOut: null,
  dynamicPrice: 0,
  setRoom: (room) => set({ selectedRoom: room, dynamicPrice: room.currentPrice }),
  updatePrice: (newPrice) => set({ dynamicPrice: newPrice }),
}));