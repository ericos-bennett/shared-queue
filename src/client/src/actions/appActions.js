import { types } from '../reducers/actionTypes';
import Cookie from 'js-cookie';
import axios from 'axios';
import { createSpotifyApi } from '../helpers'
import { getAuthUrl } from "../services";
const queryString = require('query-string');
const SERVER_URL = 'http://localhost:8080';


const setCredentials = (state, dispatch, response) => {
  const { spotifyApi } = state
  const accessToken = response.body['access_token'];
  const refreshToken = response.body['refresh_token'];
  const expiration = Date.now() + response.body['expires_in'] * 1000;

  spotifyApi.setCredentials({ expiration })
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
  !state.isLoggedIn && setLoginStatus(state, dispatch, true)
}


const refreshAccessToken = (state, dispatch) => {
  const { spotifyApi } = state
  spotifyApi.refreshAccessToken().then((response) => {
    setCredentials(state, dispatch, response)
  })
};


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

const requestLogin = (state, dispatch) => {


  const { spotifyApi } = state

  const url = getAuthUrl(spotifyApi)
  // Set verifier cookie as it is reset when redirected
  Cookie.set('verifier', spotifyApi._credentials.verifier)
  localStorage.setItem('state', JSON.stringify(state));
  dispatch({
    type: types.SET_AUTH_URL,
    payload: url,
  });

  window.location.href = url

};

const setAccessCode = (state, dispatch, res) => {
  const { spotifyApi } = state
  spotifyApi === null && setSpotifyApi(state, dispatch)
  spotifyApi.setClientVerifier(Cookie.get('verifier'))
  Cookie.remove('verifier')

  var parsed = queryString.parse(res.location.search);
  try {

    spotifyApi.authorizationCodeGrant(parsed.code).then((response) => {
      setCredentials(state, dispatch, response)
    })
  } catch (error) {
    console.log(error);
  }
};



const logout = (state, dispatch) => {
  const { spotifyApi } = state
  spotifyApi.resetAccessToken()
  spotifyApi.resetRefreshToken()
  spotifyApi.setClientVerifier(null)

  dispatch({
    type: types.LOGOUT,
    payload: false
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
  const { spotifyApi } = state
  // Create a new SDK player instance and add listeners to it
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const spotifyPlayer = new Spotify.Player({
    name: 'Spotify Mix',
    getOAuthToken: (cb) => {
      cb(spotifyApi.getAccessToken());
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
  setAccessCode,
  refreshAccessToken,
  setSpotifyApi,
  setSpotifyPlayer,
  setLoginStatus,
  updateLoginStatus,
  requestLogin,
  logout,
};
