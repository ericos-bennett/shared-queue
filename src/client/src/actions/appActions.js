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

  Cookie.set('accessToken', accessToken)
  Cookie.set('refreshToken', refreshToken)
  Cookie.set('accessTokenExpiration', expiration)
  // Cookie.set('user', spotifyApi.getUser())

}

const checkLogin = (state, dispatch) => {
  const accessTokenExpiration = Cookie.get('accessTokenExpiration')
  const accessToken = Cookie.get('accessToken')
  const refreshToken = Cookie.get('refreshToken')

  if (accessTokenExpiration && accessToken && refreshToken && accessTokenExpiration < Date.now() * 1000) {
    const { spotifyApi } = state

    spotifyApi.setCredentials({ expiration: accessTokenExpiration })
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    !state.isLoggedIn && setLoginStatus(state, dispatch, true)
    refreshAccessToken(state, dispatch)
  } else {
    state.isLoggedIn && setLoginStatus(state, dispatch, false)
    clearCookies()
  }
};

const clearCookies = () => {
  console.log(`clearCookies`)
  try {
    Cookie.remove('accessTokenExpiration')
    Cookie.remove('accessToken')
    Cookie.remove('refreshToken')
  } catch (error) {

  }
}


const refreshAccessToken = (state, dispatch) => {
  const { spotifyApi } = state
  spotifyApi.refreshAccessToken().then((response) => {
    if (response.statusCode === 200) {
      setCredentials(state, dispatch, response)
    } else {
      clearCookies()
    }

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
      if (response.statusCode === 200) {
        setCredentials(state, dispatch, response)
      } else {
        logout(state, dispatch)
      }

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
  clearCookies()
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
    // If there is an authentication error, force the user to loggin again
    logout(state, dispatch)
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
  }) => {
    dispatch({
      type: types.SET_TRACK_POSITION,
      payload: position,
    });

  });

  spotifyPlayer.connect().then((success) => {
    if (success) {
      console.log('The Web Playback SDK successfully connected to Spotify!');
    }
  });
};



export const appActions = {
  checkLogin,
  setAccessCode,
  refreshAccessToken,
  setSpotifyApi,
  setSpotifyPlayer,
  setLoginStatus,
  updateLoginStatus,
  requestLogin,
  logout,
};
