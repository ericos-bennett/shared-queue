import httpServer from 'http';
import { Server, Socket } from 'socket.io';

type Track = {
  artist: string;
  title: string;
  id: string;
  albumUrl: string;
  durationMs: number;
};

const initializeWs = (server: httpServer.Server): void => {
  const io = new Server(server);

  io.on('connection', (socket: Socket): void => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      console.log('Rooms:', io.sockets.adapter.rooms);

      const room = io.sockets.adapter.rooms.get(roomId);
      if (room!.size === 1) {
        // User is the first in the room!
        // Send back an empty object and the notice that they are first
        const emptyState = {
          tracks: [],
          currentTrackIndex: 0,
          currentTrackPosition: 0,
          isPlaying: false,
        };
        io.to(socket.id).emit('roomState', emptyState);
      } else {
        const arrRoom = [...room!];
        const firstSocketInRoom = arrRoom[0];
        console.log(firstSocketInRoom);

        // Send message to firstSocketInRoom, along with requesting socket's ID
        // firstSocketInRoom gets current state, sends back specifically to req socket
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
          currentTrackPosition: 30000,
          isPlaying: true,
        };
        io.to(socket.id).emit('roomState', dummyState);
      }
    });

    socket.on('play', (roomId: string) => {
      console.log(`Room ${roomId}: Toggle play`);
    });
    socket.on('pause', (roomId: string) => {
      console.log(`Room ${roomId}: Toggle play`);
    });
    socket.on('changeTrack', (roomId: string, direction: 'prev' | 'next') => {
      console.log(`Room ${roomId}: Go to ${direction} track`);
    });

    socket.on('deleteTrack', (roomId: string, trackIndex: number) => {
      console.log(`Room ${roomId}: Delete track at index ${trackIndex}`);
    });

    socket.on('addTrack', (roomId: string, track: Track) => {
      console.log(`Room ${roomId}: Add "${track.title}" to queue`);
    });
  });
};

export { initializeWs };
