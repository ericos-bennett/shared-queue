import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import io from 'socket.io-client';
import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

import Search2 from './Search2';
import Queue from './Queue';
import Player2 from './Player2';
import { RoomState } from '../../types';
import useRoom from '../hooks/useRoom';

const ENDPOINT = 'http://localhost:3000';

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

export default function Room2() {
  const { id } = useParams<{ id: string }>();
  const roomId = useRef<string>(id);
  const ws = useRef<SocketIOClient.Socket | null>(null);
  const {
    roomState,
    setRoomState,
    spotifyApi,
    deviceId,
    togglePlayHandler,
    changeTrackHandler,
    deleteTrackHandler,
    addTrackHandler,
  } = useRoom();
  const classes = useStyles();

  useEffect(() => {
    // 1. Get Access Token
    // Refactor this to use a session cookie on the client side, linking to tokens on server
    // 2. Connect SDK
    // 3. Request State from Peers
    // 4. Set State from Peers OR initialize as empty room

    const accessToken = Cookie.get('accessToken');
    if (!accessToken) {
      // Handle this w/ OAuth redirect
      console.log('No access token!');
    } else {
      const script = document.createElement('script');
      script.src = 'https://sdk.scdn.co/spotify-player.js';
      script.id = 'spotifyPlaybackSdk';
      document.body.appendChild(script);
      script.onload = () => {
        console.log('SDK loaded');
        // @ts-ignore
        window.onSpotifyWebPlaybackSDKReady = () => {
          // @ts-ignore
          const sdk = new Spotify.Player({
            name: 'Spotify Mix',
            getOAuthToken: (cb: any) => {
              cb(accessToken);
            },
          });

          sdk.addListener('ready', ({ device_id }: { device_id: string }) => {
            console.log('SDK connected and deviceId set');
            deviceId.current = device_id;

            // Set up WS listener and send room state request to peers
            const socket = io(ENDPOINT);

            socket.on('roomState', (state: RoomState) => {
              console.log('Room state received');
              // If you're the only one in the room, send message: you are the only one in the room add a track to get started!
              // If not response from express server, show error
              // If others in the room, return their state object and sync up with it.
              setRoomState(state);
            });

            socket.on('connect', () => {
              console.log('WS connected');
              socket.emit('joinRoom', roomId.current);
              ws.current = socket;
            });
          });

          sdk.addListener('player_state_changed', (state: any) => {
            console.log(state);
          });

          // Connect to the player!
          sdk.connect();
        };
      };
    }
  }, [deviceId, setRoomState]);

  return (
    <div className={classes.root}>
      <Container>
        <h1 className={classes.title}>Room Title</h1>
        <Search2 spotifyApi={spotifyApi} addTrackHandler={addTrackHandler} />
        <Queue roomState={roomState} deleteTrackHandler={deleteTrackHandler} />
      </Container>
      <Player2
        roomState={roomState}
        togglePlayHandler={togglePlayHandler}
        changeTrackHandler={changeTrackHandler}
      />
    </div>
  );
}