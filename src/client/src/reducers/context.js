import React from 'react';


export const Context = React.createContext();

export const initialState = {
  spotifyApi: null,
  spotifyPlayer: null,
  spotifyPlayerReady: false,
  isPlaying: false,
  currentTrackIndex: -1,
  tracks: [],
  currentTrackPosition: 0,
  roomId: '',
  isLoggedIn: false,
  deviceId: 0,
  authUrl: '',
};
