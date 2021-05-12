import { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import io from 'socket.io-client';
import Cookie from 'js-cookie';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

import Search from './Search';
import Queue from './Queue';
import Player from './Player';
import useRoom from '../hooks/useRoom';
import { Track, RoomState } from '../../types';

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

export default function Room() {
  const { id } = useParams<{ id: string }>();
  const roomId = useRef<string>(id);
  const ws = useRef<SocketIOClient.Socket | null>(null);
  const {
    roomState,
    setRoomState,
    spotifyApi,
    deviceId,
    togglePlay,
    changeTrack,
    deleteTrack,
    addTrack,
  } = useRoom();
  const classes = useStyles();

  useEffect(() => {
    // Load the Spotify Playback SDK script from its CDN
    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.id = 'spotifyPlaybackSdk';
    document.body.appendChild(script);
    script.onload = () => {
      console.log('SDK loaded');
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

        // When the player is ready, set up WS listener and request the current room state
        sdk.addListener('ready', ({ device_id }: { device_id: string }) => {
          console.log('SDK connected and deviceId set');
          deviceId.current = device_id;

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

        // Add the SDK to your Spotify device list
        sdk.connect();
      };
    };
  }, [deviceId, setRoomState]);

  const togglePlayHandler = (): void => {
    ws.current!.emit('togglePlay', roomId.current);
    togglePlay();
  };

  const changeTrackHandler = (direction: 'prev' | 'next'): void => {
    ws.current!.emit('changeTrack', roomId.current, direction);
    changeTrack(direction);
  };

  const deleteTrackHandler = (trackIndex: number) => {
    ws.current!.emit('deleteTrack', roomId.current, trackIndex);
    deleteTrack(trackIndex);
  };

  const addTrackHandler = (track: Track) => {
    ws.current!.emit('addTrack', roomId.current, track);
    addTrack(track);
  };

  return (
    <div className={classes.root}>
      <Container>
        <h1 className={classes.title}>Room Title</h1>
        <Search spotifyApi={spotifyApi} addTrackHandler={addTrackHandler} />
        <Queue roomState={roomState} deleteTrackHandler={deleteTrackHandler} />
        <Player
          roomState={roomState}
          togglePlayHandler={togglePlayHandler}
          changeTrackHandler={changeTrackHandler}
        />
      </Container>
    </div>
  );
}
