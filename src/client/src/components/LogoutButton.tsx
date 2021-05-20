import { useState, useContext, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { appActions } from '../actions/appActions';
import { Context } from '../reducers/context';

const HALF_HOUR_MS = 1800000;

const useStyles = makeStyles(theme => ({
  root: {
    position: 'fixed',
    right: '0',
    top: '0',
    margin: theme.spacing(2),
  },
  button: {
    color: 'white',
  },
}));

export default function LogoutButton() {
  const { state, dispatch } = useContext(Context);
  const classes = useStyles();
  const [logout, setLogout] = useState(false);
  const handleLogout = () => {
    appActions.logout(state, dispatch);
    setLogout(true);
  };


  useEffect(() => {
    const interval = setInterval(() => {
      appActions.refreshAccessToken(state, dispatch)
      console.log('Logs every 30 minutes');
    }, HALF_HOUR_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [state, dispatch])


  return (
    <div className={classes.root}>
      <Button onClick={handleLogout} className={classes.button}>
        Logout
      </Button>
      {logout && <Redirect to="/" />}
    </div>
  );
}
