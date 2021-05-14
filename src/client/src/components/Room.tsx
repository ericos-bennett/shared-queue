import { useEffect, useRef, useReducer, useMemo } from 'react';
import { useParams } from 'react-router';
import io from 'socket.io-client';
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

  useEffect(() => {
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
      // Create a new SDK player instance and add listeners to it
      // @ts-ignore
      const sdk = new Spotify.Player({
        name: 'Spotify Mix',
        getOAuthToken: (cb: any) => {
          cb(Cookie.get('accessToken'));
        },
      });

      // Error handling
      sdk.addListener('initialization_error', ( message:sdkErrorMessage) => { console.error(message); });
      sdk.addListener('authentication_error', (message:sdkErrorMessage) => { console.error(message); });
      sdk.addListener('account_error', (message:sdkErrorMessage) => { console.error(message); });
      sdk.addListener('playback_error', (message:sdkErrorMessage) => { console.error(message); });

      // When the player is ready, set up WS listener and request the current room state
      sdk.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('SDK connected and deviceId set');
        roomActions.setDeviceId(dispatch, device_id)

        const socket = io(ENDPOINT);
        roomActions.setWebsocket(dispatch, {ws:socket})
        socket.on('roomState', (state: RoomState) => {
          console.log('Room state received');
          // If you're the only one in the room, send message: you are the only one in the room add a track to get started!
          // If not response from express server, show error
          // If others in the room, return their state object and sync up with it.
          roomActions.setRoomState(dispatch, state);
        });

        socket.on('togglePlay', () => {
          // Should call the togglePlay function locally
          console.log('togglePlay from peer');
        });

        socket.on('connect', () => {
          console.log('WS connected');
          socket.emit('joinRoom', roomId.current);
          // roomActions.setWebsocket(dispatch, {ws:socket})
          // ws.current = socket;
        });
      });

      // Add the SDK to your Spotify device list
      sdk.connect();


  };
  }, []);

    // create object to be passed as value, using memo to encapsulate against unnecessary updates
    const roomContextValue = useMemo(() => {
      return {
        state,
        dispatch
      }
  }, [state, dispatch])

  return (
    <RoomContext.Provider value={roomContextValue} >
    <div className={classes.root}>
      <Container>
        <h1 className={classes.title}>Room Title</h1>
        <Search /> 
        <Queue />
        <Player />
      </Container>
    </div>
    </RoomContext.Provider>
  );
}
