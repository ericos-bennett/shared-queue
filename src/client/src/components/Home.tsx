import { useEffect, useContext, useCallback } from 'react';
import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { Context } from '../reducers/context';
import CreateButton from './CreateButton';
import AuthButton from './AuthButton';
import LogoutButton from './LogoutButton';
import SpotifyWebApi from 'spotify-web-api-node';
import { appActions } from '../actions/appActions';


const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(90deg, #2c5e92 0%, #552f6d 80%)',
  },
  banner: {
    width: '60%',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  description: {
    paddingTop: '40px',
    textAlign: 'center',
  },
}));

export default function Home() {
  const { state, dispatch } = useContext(Context);
  const classes = useStyles();


  const setSpotify = useCallback(() => {
    if (!document.getElementById('spotifyPlaybackSdk')) {
      // Load the Spotify Playback SDK script from its CDN
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.id = 'spotifyPlaybackSdk';
      document.body.appendChild(script);
      console.log('SDK added to body');

      const api = new SpotifyWebApi({});
      api.setAccessToken(Cookie.get('accessToken')!);
      api.setRefreshToken(Cookie.get('refreshToken')!);

      appActions.setSpotifyApi(dispatch, api);

      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = () => {
        appActions.setSpotifyPlayer(state, dispatch);
      };
    }
  }, [dispatch, state]);

  useEffect(() => {
    if (!state.spotifyPlayer) {
      setSpotify();
    }
  }, [setSpotify, state.spotifyPlayer]);


  return (
    <div className={classes.root}>
      <div className={classes.banner}>
        {state.logged_in && <LogoutButton />}
        <Typography variant="h2">Welcome to Spotify Mix!</Typography>
        <Typography variant="h4" className={classes.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </Typography>
      </div>
      {Cookie.get('accessToken') ? <CreateButton /> : <AuthButton />}
    </div>
  );
}
