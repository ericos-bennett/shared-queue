import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Room from './Room';

export default function App() {
  
  return (
    <Router>
      <Switch>
        <Route path='/' exact component={Home}/>
        <Route path='/room/:id'component={Room}/>
      </Switch>
    </Router>
  )

}