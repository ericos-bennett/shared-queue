import { useEffect, useRef, useContext, useCallback } from 'react';
import { useParams } from 'react-router';
// import io from 'socket.io-client';
import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';
import Context from '../reducers/context';

import Search from './Search';
import Queue from './Queue';
import Player from './Player';

import { roomActions } from '../actions/roomActions';
import SpotifyWebApi from 'spotify-web-api-node';
import { playerActions } from '../actions/playerActions';

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
  const { state, dispatch } = useContext(Context);
  const { id } = useParams<{ id: string }>();
  const roomId = useRef<string>(id);
  // const socket = useRef<string>(id);
  const classes = useStyles();

  const setSpotify = useCallback(() => {
    if (!document.getElementById('spotifyPlaybackSdk')) {
      roomActions.setRoomId(dispatch, roomId.current);
      // Load the Spotify Playback SDK script from its CDN
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.id = 'spotifyPlaybackSdk';
      document.body.appendChild(script);
      console.log('SDK added to body');

      const api = new SpotifyWebApi({});
      api.setAccessToken(Cookie.get('accessToken')!);
      roomActions.setSpotifyApi(dispatch, api);

      // @ts-ignore
      window.onSpotifyWebPlaybackSDKReady = () => {
        roomActions.setSpotifyPlayer(state, dispatch);
      };
    }
  }, [dispatch, state]);

  // I think we can fill out the dependency array for this useEffect, the callback should only be called once regardless due to the conditional
  useEffect(() => {
    if (!state.spotifyPlayer) {
      setSpotify();
    }
  }, []);

  const setSocket = useCallback(() => {
    playerActions.setWS(state, dispatch);
  }, [dispatch, state]);

  useEffect(() => {
    console.info('useEffect >> state.roomId:', state.roomId);
    if (state.roomId) {
      setSocket();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Again, we could fill out the dependencies but add a conditional so setSocket is only fired once
  }, [state.roomId]);

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
