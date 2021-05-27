import httpServer from 'http';
import { Server, Socket } from 'socket.io';

type Track = {
  artist: string;
  title: string;
  id: string;
  albumUrl: string;
  durationMs: number;
};

// let roomState = {
//   tracks: [],
//   currentTrackIndex: 0,
//   currentTrackPosition: 0,
//   isPlaying: false,
// };

const initializeWs = (server: httpServer.Server): void => {
  const io = new Server(server);

  io.on('connection', (socket: Socket): void => {
    console.log('Socket connected:', socket.id);

    socket.on('joinRoom', (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);
      console.log('Rooms:', io.sockets.adapter.rooms);

      // If there is a peer, get initial state from the first user in the room.
      // If not, take empty state
      // socket.to(socket.id).emit('roomState', roomState);
    });

    socket.on('play', (roomId: string) => {
      console.log(`Room ${roomId}: play`);
      socket.to(roomId).emit('play');
    });
    socket.on('pause', (roomId: string) => {
      console.log(`Room ${roomId}: pause`);
      socket.to(roomId).emit('pause');
    });

    socket.on('deleteTrack', (roomId: string, trackIndex: number) => {
      console.log(`Room ${roomId}: Delete track at index ${trackIndex}`);
      socket.to(roomId).emit('deleteTrack', trackIndex);
    });

    socket.on('addTrack', (roomId: string, track: Track) => {
      console.log(`Room ${roomId}: Add "${track.title}" to queue`);
      socket.to(roomId).emit('addTrack', track);
    });
    socket.on('changeTrack', (roomId: string, trackIndex: number) => {
      console.log(`Room ${roomId}: Change track to ${trackIndex}`);
      socket.to(roomId).emit('changeTrack', trackIndex);
    });
  });
};

// 0. Click button to pause
// 1. WS message sent to room peers
// 2. State is updated locally

export { initializeWs };
