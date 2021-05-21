/* eslint-disable no-redeclare */
// I think we should rename this actionTypes so it's not confusing with the TS types file
import { types } from './actionTypes';

export default function reducer(state, action) {
  switch (action.type) {

    case types.SET_AUTH_URL:
      return {
        ...state,
        authUrl: action.payload,
      };

    case types.LOGOUT:
    case types.LOGIN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };
    case types.SET_ROOM_ID:
      return {
        ...state,
        roomId: action.payload,
      };
    case types.SET_SPOTIFY_API:
      return {
        ...state,
        spotifyApi: action.payload,
      };
    case types.SET_SPOTIFY_PLAYER:
      return {
        ...state,
        spotifyPlayer: action.payload,
      };
    case types.SET_SPOTIFY_PLAYER_READY:
      return {
        ...state,
        spotifyPlayerReady: action.payload,
      };
    case types.SET_ROOM_STATE:
      return {
        ...state,
        roomState: action.payload,
      };
    case types.PAUSE:
      return {
        ...state,
        isPlaying: false,
      };
    case types.PLAY:
      return {
        ...state,
        isPlaying: true,
      };
    case types.CHANGE_TRACK:
      return {
        ...state,
        currentTrackIndex: action.payload,
      };

    case types.DELETE_TRACK:
      const { trackIndex } = action.payload;

      let newTracks = state.tracks
      newTracks.splice(trackIndex, 1)
      return {
        ...state,
        tracks: newTracks,
      };

    case types.ADD_TRACK: {
      const { tracks } = state;
      let newTracks = [...tracks]
      newTracks.push(action.payload);
      return {
        ...state,
        tracks: newTracks
      };
    }

    case types.SET_DEVICE_ID: {
      return {
        ...state,
        deviceId: action.payload,
      };
    }
    case types.EXIT_ROOM: {
      return {
        ...state,
        isPlaying: false,
        currentTrackIndex: 0,
        tracks: [],
        currentTrackPosition: 0,
        roomId: '',
      };
    }

    default:
      return state;
  }
}
