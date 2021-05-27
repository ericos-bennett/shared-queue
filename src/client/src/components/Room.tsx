import { useEffect, useRef, useContext, useState, useCallback } from 'react';
import socketio from "socket.io-client";
import { useParams } from 'react-router';
import { Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { Container } from '@material-ui/core';

// Components 
import ExitRoomButton from './ExitRoomButton';
import LogoutButton from './LogoutButton';
import Search from './Search';
import Queue from './Queue';
import Player from './Player';

// Actions
import { roomActions } from '../actions/roomActions';
import { playerActions } from '../actions/playerActions';

// Context
import { Context } from '../reducers/context';
import { SocketContext } from '../reducers/socketContext';

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

const ENDPOINT = 'http://localhost:8080';

export default function RoomWrapper() {
  const { state, dispatch } = useContext(Context);
  const { id } = useParams<{ id: string }>();
  const roomId = useRef<string>(id);
  const socket = useRef<SocketIOClient.Socket | null>(null);
  const [isConnected, setConnected] = useState(false)
  const [response, setResponse] = useState({ command: '', data: '' })

  const classes = useStyles();

  useEffect(() => {
    roomActions.setRoomId(dispatch, roomId.current);
  }, [dispatch])


  useEffect(() => {
    !state.spotifyApi && <Redirect to="/" />
  }, [state.spotifyApi])

  useEffect(() => {

    const { command, data } = response
    if (command) {
      switch (command) {

        case 'requestRoomState':

          const { tracks, currentTrackPosition, currentTrackIndex, isPlaying } = state
          const roomState = {
            tracks,
            currentTrackPosition,
            currentTrackIndex,
            isPlaying
          }
          socket.current && socket.current.emit('roomState', roomId.current, roomState);

          break;
        case 'roomState':
          playerActions.updateRoomState(state, dispatch, data)

          break;
        case 'changeTrack':
          playerActions.changeTrack(state, dispatch, data)

          break;
        case 'play':
          playerActions.play(state, dispatch)

          break;
        case 'pause':
          playerActions.pause(state, dispatch)
          break;
        case 'addTrack':
          playerActions.addTrack(state, dispatch, data)
          break;
        case 'deleteTrack':
          playerActions.deleteTrack(state, dispatch, data)
          break;
        default:
          break;
      }
      setResponse({ command: '', data: '' })
    }

  }, [response, state, dispatch])

  const closeSession = useCallback(
    () => {
      socket.current && socket.current.disconnect()
    },
    [socket],
  )

  useEffect(() => {
    if (!isConnected) {
      socket.current = socketio.connect(ENDPOINT, { transports: ['websocket', 'polling'] });

      socket.current.emit('joinRoom', roomId.current);

      socket.current.on('requestRoomState', () => {
        console.log('request for roomState');
        setResponse({ command: 'requestRoomState', data: 'requestRoomState' })
      });

      socket.current.on('roomState', (roomState: any) => {
        console.log('update roomState:', roomState);
        setResponse({ command: 'roomState', data: roomState })
      });

      socket.current.on('addTrack', (track: any) => {
        console.log('addTrack from peer');
        setResponse({ command: 'addTrack', data: track })
      });
      socket.current.on('changeTrack', (number: any) => {
        console.log('changeTrack from peer:', number);
        setResponse({ command: 'changeTrack', data: number })
      });
      socket.current.on('play', () => {
        console.log('play from peer');
        setResponse({ command: 'play', data: 'play' })
      });
      socket.current.on('pause', () => {
        console.log('pause from peer');
        setResponse({ command: 'pause', data: 'pause' })
      });
      socket.current.on('deleteTrack', (queueIndex: any) => {
        console.log(`delete Track ${queueIndex} from peer`);
        setResponse({ command: 'deleteTrack', data: queueIndex })
      });

      setConnected(true)
    }

  }, [isConnected, closeSession])

  useEffect(() => {
    return () => closeSession();
  }, [closeSession])


  const renderRoom = () => {

    return (
      <SocketContext.Provider value={socket.current}>
        <div className={classes.root}>
          <Container>
            <h1 className={classes.title}>Room: {state.roomId}</h1>
            <LogoutButton />
            <ExitRoomButton />
            <Search />
            <Queue />
            <Player />
          </Container>
        </div>
      </SocketContext.Provider>
    );
  }

  return (
    roomId.current ? renderRoom() : null
  );
}
