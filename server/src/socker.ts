import { Server } from 'socket.io';

export const initSocket = (server: any) => {
  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL }
  });

  io.on('connection', (socket) => {
    console.log('Admin/Guest connected:', socket.id);
    
    // Join a room based on Hotel ID or User ID
    socket.on('join-room', (roomId) => socket.join(roomId));
  });

  return io;
};