import React from 'react';

export const Context = React.createContext();

export const initialState = {
  spotifyApi: null,
  spotifyPlayer: null,
  spotifyPlayerReady: false,
  isPlaying: false,
  currentTrackIndex: 0,
  tracks: [],
  currentTrackPosition: 0,
  roomId: '',
  LoggedIn: false,
  deviceId: 0,
  isConnected: false,
  playlistId: '',
};
