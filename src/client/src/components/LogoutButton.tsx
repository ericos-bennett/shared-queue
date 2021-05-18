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
    appActions.logout(dispatch);
    setLogout(true);
  };


  useEffect(() => {
    const interval = setInterval(() => {

      // clientId, clientSecret and refreshToken has been set on the api object previous to this call.
      state.spotifyApi.refreshAccessToken().then(
        function (data: any) {
          console.log('The access token has been refreshed!');

          // Save the access token so that it's used in future calls
          state.spotifyApi.setAccessToken(data.body['access_token']);
        },
        function (err: any) {
          console.log('Could not refresh access token', err);
        }
      );

      console.log('Logs every 30 minutes');
    }, HALF_HOUR_MS);

    return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [state.spotifyApi])


  return (
    <div className={classes.root}>
      <Button onClick={handleLogout} className={classes.button}>
        Logout
      </Button>
      {logout && <Redirect to="/" />}
    </div>
  );
}
