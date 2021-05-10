import httpServer from 'http';
import { Server, Socket } from 'socket.io';

const initializeWs = (server: httpServer.Server): void => {
  const io = new Server(server, {
    // Options ...
  });

  io.on('connection', (socket: Socket): void => {
    console.log('Socket connected:', socket.id);
    const dummyState = {
      tracks: [
        {
          artist: 'Song Artist',
          title: 'Song Title',
          id: '123',
          albumUrl: 'Song Album',
          durationMs: 100000,
        },
        {
          artist: 'Song2 Artist',
          title: 'Song2 Title',
          id: '234',
          albumUrl: 'Song2 Album',
          durationMs: 100000,
        },
      ],
      currentTrackIndex: 1,
      currentTrackPosition: 50000,
      isPlaying: false,
    };
    io.to(socket.id).emit('roomStateRes', dummyState);
  });
};

export { initializeWs };
