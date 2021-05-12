import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Cookie from 'js-cookie';
import Home from './Home';
import Room2 from './Room2';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route
          path="/room/:id"
          render={() => (Cookie.get('accessToken') ? <Room2 /> : <Redirect to="/" />)}
        />
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}
