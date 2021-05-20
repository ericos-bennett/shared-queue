import { useReducer, useMemo, useEffect, useCallback } from 'react';
import { Context, initialState } from '../reducers/context';
import { appActions } from '../actions/appActions';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Room from './Room';
import playerReducer from '../reducers/reducer';

export default function App() {

  const [state, dispatch] = useReducer(playerReducer, initialState);

  const login_res = useCallback(
    (e: any) => {
      console.info('login_res');
      // TODO: surely there is a better way
      const location = e.location;

      const loginResult = location.search.substring(0, 6) === '?code=';

      const code = loginResult && location.search.substring(6, location.search.length);

      // You only get the code if loginResult is true, so could we just skip sending loginResult in the payload?
      appActions.updateLoginStatus(state, dispatch, { loginResult, code });
      return <Redirect to="/" />;
    },
    [state]
  );


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


  // create object to be passed as value, using memo to encapsulate against unnecessary updates
  const ContextValue = useMemo(() => {
    return {
      state,
      dispatch,
    };
  }, [state, dispatch]);

  return (
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
  );
}
