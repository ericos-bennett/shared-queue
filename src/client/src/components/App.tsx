import { useReducer, useMemo, useEffect, useCallback } from 'react';
import { Context, initialState } from '../reducers/context';
import { appActions } from '../actions/appActions';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';

import Home from './Home';
import Room from './Room';
import playerReducer from '../reducers/reducer';
import Cookie from 'js-cookie';

export default function App() {
  const [state, dispatch] = useReducer(playerReducer, initialState);

  const login_res = useCallback(
    (e: any) => {
      console.info('login_res');
      // TODO: surely there is a better way
      const location = e.location;

      // I think we should use camelCase for JS variable names, it's the convention
      const login_result = location.search.substring(0, 6) === '?code=';

      const code = login_result && location.search.substring(6, location.search.length);

      // You only get the code if login_result is true, so could we just skip sending login_result in the payload?
      appActions.updateLoginStatus(state, dispatch, { login_result, code });
      return <Redirect to="/" />;
    },
    [state]
  );

  const setIsAuthenticated = useCallback(() => {
    console.info('setIsAuthenticated');
    Cookie.get('accessToken') &&
      !state.logged_in &&
      appActions.setLoginStatus(state, dispatch, true);
  }, [state, dispatch]);

  useEffect(() => {
    setIsAuthenticated();
  }, [setIsAuthenticated]);

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
            render={() => (Cookie.get('accessToken') ? <Room /> : <Redirect to="/" />)}
          />
          <Route path="/login_res" render={login_res} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </Context.Provider>
  );
}
