import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import { Context } from '../reducers/context';
import { appActions } from '../actions/appActions';

const useStyles = makeStyles(() => ({
  root: {
    color: 'white',
    borderColor: 'white',
    backgroundColor: '#159442',
    height: '3rem',
    ' &:hover': {
      backgroundColor: '#1DB954',
    },
  },
}));

export default function AuthButton() {
  const { state, dispatch } = useContext(Context);
  const classes = useStyles();

  const handleLogin = () => {
    appActions.requestLogin(state, dispatch);
  };

  return (
    <Button variant="contained" onClick={handleLogin} className={classes.root}>
      Login With Spotify
    </Button>
  );
}
