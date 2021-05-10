import httpServer from 'http';
import { stringify } from 'node:querystring';
import { Server, Socket } from 'socket.io';

const initializeWs = (server: httpServer.Server): void => {
  const io = new Server(server, {
    // Options ...
  });

  io.on('connection', (socket: Socket): void => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', (roomId: string) => {
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      console.log('Rooms:', io.sockets.adapter.rooms);
      // Get room state from other room peers (instead of using this dummy state)
      const dummyState = {
        tracks: [
          {
            artist: 'Pink Floyd',
            title: 'Dogs',
            id: '2jvuMDqBK04WvCYYz5qjvG',
            albumUrl: 'https://i.scdn.co/image/ab67616d000048510671b43480c4cfb4b5667857',
            durationMs: 1025280,
          },
          {
            artist: 'Iain Howie',
            title: 'Shift',
            id: '3nRsZusYfXimeOOxM4pWjA',
            albumUrl: 'https://i.scdn.co/image/ab67616d0000485147c40f16fcb97061d445a05a',
            durationMs: 242216,
          },
        ],
        currentTrackIndex: 1,
        currentTrackPosition: 50000,
        isPlaying: false,
      };
      io.to(socket.id).emit('roomState', dummyState);
    });
  });
};

export { initializeWs };
