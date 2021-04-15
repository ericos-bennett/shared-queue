import httpServer from 'http';
import { Server, Socket } from "socket.io";

const initializeWs = (server: httpServer.Server) => {

  const io = new Server(server, {
    // Options ...
  });
  
  io.on("connection", (socket: Socket): void => {
    console.log('Socket connected:', socket.id);
  
    // Join Room hanlder
    socket.on('join', (roomId: string): void => {
      socket.join(roomId);
      console.log(`Socket joined room: ${roomId}`);
      console.log('Rooms: ', io.sockets.adapter.rooms);
      socket.to(roomId).emit('data', 'Another user joined the room!');
    });
  
    // Delete Track handler
    socket.on('delete', (playlistId: string, index: number): void => {
      socket.to(playlistId).emit('delete', index);
    });
  
    // Add Track hanlder
    socket.on('add', (playlistId: string, track: SpotifyApi.TrackObjectFull): void => {
      socket.to(playlistId).emit('add', track);
    });
  
  });

};

export { initializeWs };