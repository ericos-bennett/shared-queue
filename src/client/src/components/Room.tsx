import { useEffect, useRef, useReducer, useMemo } from 'react';
import { useParams } from 'react-router';
// import io from 'socket.io-client';
import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import {RoomContext, initialState} from '../reducers/roomContext';
import playerReducer from '../reducers/roomReducer';
import Search from './Search';
import Queue from './Queue';
import Player from './Player';
import { RoomState, sdkErrorMessage } from '../../types';
import { roomActions } from '../actions/roomActions';
import SpotifyWebApi from 'spotify-web-api-node';

const ENDPOINT = 'https://localhost:3000';

const useStyles = makeStyles(() => ({
  root: {
    width: '100vw',
    height: '100vh',
    overflow: 'auto',
    backgroundColor: '#CDCDCD',
  },
  title: {
    textAlign: 'center',
  },
}));

export default function Room() {
  const { id } = useParams<{ id: string }>(); 
  const roomId = useRef<string>(id);
  const [state, dispatch] = useReducer(playerReducer, initialState)

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
      roomActions.setSpotifyApi(dispatch, api)

          // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = () => {
        roomActions.setSpotifyPlayer(state, dispatch)
      };
    }      
  },
    [dispatch, state],
  )

  useEffect(() => {

    setSpotify()
  
  }, [setSpotify]);



  return (

    <div className={classes.root}>
      <Container>
        <h1 className={classes.title}>Room Title</h1>
        <Search /> 
        <Queue />
        <Player />
      </Container>
    </div>

  );
}
