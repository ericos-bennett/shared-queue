import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Context from '../reducers/context';
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
  const { dispatch } = useContext(Context);
  const classes = useStyles();

  // Does the URL need to be sent to the action here?
  const userAuthRedirect = () => {
    appActions.requestLogin(dispatch, { href: window.location.href });
  };

  return (
    <Button variant="contained" onClick={userAuthRedirect} className={classes.root}>
      Login With Spotify
    </Button>
  );
}
