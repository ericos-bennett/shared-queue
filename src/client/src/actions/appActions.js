import { types } from '../reducers/actionTypes';
import Cookie from 'js-cookie';
import axios from 'axios';

const SERVER_URL = 'http://localhost:8080';

const setLoginStatus = (state, dispatch, payload) => {
  dispatch({
    type: types.LOGIN,
    payload: payload,
  });
};

const updateLoginStatus = (state, dispatch, payload) => {
  const { loginResult, code } = payload;
  if (loginResult) {
    loginResult && Cookie.set('accessToken', code);
    const url = `${SERVER_URL}/api/auth/token/?code=${code}`;
    // ${code}
    axios
      .get(url, {
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      })
      .then(res => {
        dispatch({
          type: types.LOGIN,
          payload: loginResult,
        });
      });
  }
};
const requestLogin = (dispatch) => {
  axios.get('/api/auth/code').then(res => {
    window.location.href = res.data;
  });
};

const logout = (dispatch, payload) => {
  Cookie.remove('accessToken');
  Cookie.remove('refreshToken');
  Cookie.remove('userId');
  Cookie.remove('expiration');
  dispatch({
    type: types.LOGOUT,
    payload: false,
  });
};

const setSpotifyApi = (state, dispatch) => {
  console.info('setSpotifyApi');

  if (state.spotifyApi !== null) {
    return;
  }

  const spotifyApi = createSpotifyApi()

  dispatch({
    type: types.SET_SPOTIFY_API,
    payload: spotifyApi,
  });

};

const setSpotifyPlayer = (state, dispatch) => {
  console.info('setSpotifyPlayer');
  // Create a new SDK player instance and add listeners to it
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const spotifyPlayer = new Spotify.Player({
    name: 'Spotify Mix',
    getOAuthToken: (cb) => {
      cb(Cookie.get('accessToken'));
    },
  });

  // // Error handling
  spotifyPlayer.addListener('initialization_error', (message) => {
    console.error(message);
  });
  spotifyPlayer.addListener('authentication_error', (message) => {
    console.error(message);
  });
  spotifyPlayer.addListener('account_error', (message) => {
    console.error(message);
  });
  spotifyPlayer.addListener('playback_error', (message) => {
    console.error(message);
  });

  // Update the current state to indicate the player is ready to accept requests
  spotifyPlayer.addListener('ready', ({ device_id }) => {
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

  spotifyPlayer.addListener('not_ready', ({ device_id }) => {
    console.log('Device ID is not ready for playback', device_id);
  });


  spotifyPlayer.addListener('player_state_changed', ({
    position,
    duration,
    track_window: { current_track }
  }) => {
    console.log('Currently Playing', current_track);
    console.log('Position in Song', position);
    console.log('Duration of Song', duration);
  });

  spotifyPlayer.connect().then((success) => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    }
  });
};


export const appActions = {
  setSpotifyApi,
  setSpotifyPlayer,
  setLoginStatus,
  updateLoginStatus,
  requestLogin,
  logout,
};
