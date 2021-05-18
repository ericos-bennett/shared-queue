import { types } from '../reducers/actionTypes';

const setRoomId = (dispatch: any, payload: any) => {
  console.info('setRoomId');
  dispatch({
    type: types.SET_ROOM_ID,
    payload,
  });
};

const setSpotifyApi = (dispatch: any, payload: any) => {
  console.info('setSpotifyApi');
  dispatch({
    type: types.SET_SPOTIFY_API,
    payload,
  });
};

const setSpotifyPlayer = (state: any, dispatch: any) => {
  console.info('setSpotifyPlayer');
  // Create a new SDK player instance and add listeners to it
  // @ts-ignore
  const spotifyPlayer = new Spotify.Player({
    name: 'Spotify Mix',
    getOAuthToken: (cb: any) => {
      cb(Cookie.get('accessToken'));
    },
  });

  // // Error handling
  spotifyPlayer.addListener('initialization_error', (message: sdkErrorMessage) => {
    console.error(message);
  });
  spotifyPlayer.addListener('authentication_error', (message: sdkErrorMessage) => {
    console.error(message);
  });
  spotifyPlayer.addListener('account_error', (message: sdkErrorMessage) => {
    console.error(message);
  });
  spotifyPlayer.addListener('playback_error', (message: sdkErrorMessage) => {
    console.error(message);
  });

  // Update the current state to indicate the player is ready to accept requests
  spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
    dispatch({
      type: types.SET_SPOTIFY_PLAYER_READY,
      payload: true,
    });
    dispatch({
      type: types.SET_SPOTIFY_PLAYER,
      payload: spotifyPlayer,
    });
    dispatch({
      type: types.SET_DEVICE_ID,
      payload: device_id,
    });
  });

  spotifyPlayer.addListener('not_ready', ({ device_id }: any) => {
    console.log('Device ID is not ready for playback', device_id);
  });

  spotifyPlayer.connect().then((success: boolean) => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    }
  });
};

export const roomActions = {
  setRoomId,
  setSpotifyApi,
  setSpotifyPlayer,
};
