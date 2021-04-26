import httpServer from 'http';
import { Server, Socket } from "socket.io";

const initializeWs = (server: httpServer.Server): void => {

  const io = new Server(server, {
    // Options ...
  });
  
  io.on("connection", (socket: Socket): void => {
    console.log('Socket connected:', socket.id);
  
    // Join Room hanlder
    socket.on('join', (playlistId: string, username: string): void => {
      socket.join(playlistId);
      console.log(`Socket joined room: ${playlistId}`);
      console.log('Rooms: ', io.sockets.adapter.rooms);
      socket.to(playlistId).emit('peerJoin', username);
    });

    // Playback Status Forwarding
    socket.on('playbackStatus', (playlistId: string, playbackStatus) => {
      console.log(playbackStatus)
      socket.to(playlistId).emit('playbackStatus', playbackStatus);
    })
  
    // Delete Track handler
    socket.on('delete', (playlistId: string, index: number): void => {
      socket.to(playlistId).emit('delete', index);
    });
  
    // Add Track hanlder
    socket.on('add', (playlistId: string, track: SpotifyApi.TrackObjectFull): void => {
      socket.to(playlistId).emit('add', track);
    });

    // Toggle play hanlder
    socket.on('togglePlay', (playlistId: string, play: boolean): void => {
      socket.to(playlistId).emit('togglePlay', play);
    });

    // Change track hanlder
    socket.on('changeTrack', (playlistId: string, trackId: string): void => {
      socket.to(playlistId).emit('changeTrack', trackId);
    });
  
  });

};

export { initializeWs };