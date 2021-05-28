import { useReducer, useMemo, useEffect, useCallback } from 'react';
import { Context, initialState } from '../reducers/context';
import { appActions } from '../actions/appActions';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Room from './Room'
import playerReducer from '../reducers/reducer';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'
// import AlertTemplate from "../libs/AlertTemplate/AlertTemplate";
import AlertTemplate from 'react-alert-template-basic'

const CHECK_AUTH_INTERVAL_MS = 300000; // 5 MIN

export default function App() {

  const [state, dispatch] = useReducer(playerReducer, initialState);

  appActions.setSpotifyApi(state, dispatch);

  const login_res = useCallback((res: any) => {
    console.info('login_res');

    appActions.setAccessCode(state, dispatch, res)

    return <Redirect to="/" />;
  },
    [state]
  );

  // optional configuration
  const options = {
    // you can also just use 'bottom center'
    position: positions.BOTTOM_RIGHT,
    timeout: 5000,
    offset: '3px',
    // you can also just use 'scale'
    transition: transitions.SCALE
  }


  useEffect(() => {
    if (state.spotifyApi.getCredentials().expiration) {

      const interval = setInterval(() => {
        const expiration = state.spotifyApi.getCredentials().expiration

        if (expiration < Date.now() && state.isLoggedIn) {
          appActions.logout(state, dispatch)
        } else if (expiration - Date.now() < CHECK_AUTH_INTERVAL_MS) {
          console.info('Refresh Access Token')
          appActions.refreshAccessToken(state, dispatch)
        }


      }, CHECK_AUTH_INTERVAL_MS);

      return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
    }
  }, [state, dispatch])

  const setSpotify = useCallback(() => {
    if (!document.getElementById('spotifyPlaybackSdk')) {
      // Load the Spotify Playback SDK script from its CDN
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.id = 'spotifyPlaybackSdk';
      document.body.appendChild(script);
      console.log('SDK added to body');
      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = () => {
        appActions.setSpotifyPlayer(state, dispatch);
      };
    }
  }, [dispatch, state]);

  useEffect(() => {
    state.isLoggedIn && setSpotify()
  }, [setSpotify, state.isLoggedIn]);

  useEffect(() => {
    appActions.checkLogin(state, dispatch)
    // eslint-disable-next-line 
  }, [])

  // create object to be passed as value, using memo to encapsulate against unnecessary updates
  const ContextValue = useMemo(() => {
    return {
      state,
      dispatch,
    };
  }, [state, dispatch]);

  return (
    <AlertProvider template={AlertTemplate} {...options}>
      <Context.Provider value={ContextValue}>

        <Router>
          <Switch>
            <Route path="/" exact>
              <Home />
            </Route>
            <Route
              path="/room/:id"
              render={() => (state.isLoggedIn ? <Room /> : <Redirect to="/" />)}
            />
            <Route path="/api/auth/token" render={login_res} />
            <Redirect from="*" to="/" />
          </Switch>
        </Router>

      </Context.Provider>
    </AlertProvider>
  );
}
