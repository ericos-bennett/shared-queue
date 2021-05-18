/* eslint-disable no-redeclare */
// I think we should rename this actionTypes so it's not confusing with the TS types file
import { types } from './actionTypes';

export default function reducer(state, action) {
  switch (action.type) {
    case types.LOGOUT:
    case types.LOGIN:
      return {
        ...state,
        login_loading: false,
        logged_in: action.payload,
      };
    case types.SET_ROOM_ID:
      console.log(`action.payload`, action.payload);
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
      const { currentTrackIndex, tracks } = action.payload;

      return {
        ...state,
        tracks,
        currentTrackIndex,
      };

    case types.ADD_TRACK: {
      const { track } = action.payload;
      // I think you need to spread state.tracks here, or else it overwrites the state in place
      let tracks = state.tracks;
      tracks.push(track);

      return {
        ...state,
        tracks,
      };
    }

    case types.SET_DEVICE_ID: {
      return {
        ...state,
        deviceId: action.payload,
      };
    }

    default:
      return state;
  }
}
