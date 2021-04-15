import { useState, useEffect } from 'react';
import Cookies from "js-cookie";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';
import Room from './Room';

export default function App() {
  
  const [user, setUser] = useState('');

  useEffect((): void => {
    const userId = Cookies.get('userId');
    if (userId) setUser(userId);
  }, []);

  return (
    <Router>
      <Switch>
        <Route path='/' exact>
          <Home user={user}/>
        </Route>
        <Route path='/room/:id'>
          <Room user={user}/>
        </Route>
      </Switch>
    </Router>
  )

}