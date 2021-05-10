import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Room from './Room';
import Room2 from './Room2';

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/room/:id">
          <Room />
        </Route>
        <Route path="/room2/:id">
          <Room2 />
        </Route>
        <Redirect from="*" to="/" />
      </Switch>
    </Router>
  );
}
