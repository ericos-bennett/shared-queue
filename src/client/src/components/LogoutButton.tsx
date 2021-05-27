import { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import { Redirect } from 'react-router-dom';
import { appActions } from '../actions/appActions';
import { Context } from '../reducers/context';
import { SocketContext } from '../reducers/socketContext';


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
  const socket = useContext(SocketContext);
  const handleLogout = () => {
    socket && socket.disconnect()
    appActions.logout(state, dispatch);
    setLogout(true);
  };

  return (
    <div className={classes.root}>
      <Button onClick={handleLogout} className={classes.button}>
        Logout
      </Button>
      {logout && <Redirect to="/" />}
    </div>
  );
}
