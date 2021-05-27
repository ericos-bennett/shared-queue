import { useEffect, useRef, useContext, useState } from 'react';
import { SocketContext } from '../reducers/socketContext';
import Room from './Room';
import socketio from "socket.io-client";
import { Context } from '../reducers/context';
import { useParams } from 'react-router';
import { roomActions } from '../actions/roomActions';
import { playerActions } from '../actions/playerActions';

const ENDPOINT = 'http://localhost:8080';
export default function RoomWrapper() {
  const { state, dispatch } = useContext(Context);
  const { id } = useParams();
  const roomId = useRef(id);
  const socket = useRef()
  const [isConnected, setConnected] = useState(false)
  const [response, setResponse] = useState({ command: '', data: '' })

  useEffect(() => {
    roomActions.setRoomId(dispatch, roomId.current);
  }, [dispatch])


  useEffect(() => {
    console.log(`response`, response)
    console.log(`state`, state)
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
          socket.current.emit('roomState', roomId.current, roomState);

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


  if (!isConnected) {
    socket.current = socketio.connect(ENDPOINT, { transports: ['websocket', 'polling'] });

    socket.current.emit('joinRoom', roomId.current);

    socket.current.on('requestRoomState', () => {
      console.log('request for roomState');
      setResponse({ command: 'requestRoomState', data: 'requestRoomState' })
    });

    socket.current.on('roomState', (roomState) => {
      console.log('update roomState:', roomState);
      setResponse({ command: 'roomState', data: roomState })
    });

    socket.current.on('addTrack', (track) => {
      console.log('addTrack from peer');
      setResponse({ command: 'addTrack', data: track })
    });
    socket.current.on('changeTrack', (number) => {
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
    socket.current.on('deleteTrack', (queueIndex) => {
      console.log(`delete Track ${queueIndex} from peer`);
      setResponse({ command: 'deleteTrack', data: queueIndex })
    });

    setConnected(true)
  }

  const renderRoom = () => {

    return (
      <SocketContext.Provider value={socket.current}>
        <Room />
      </SocketContext.Provider>
    );
  }

  return (
    roomId.current ? renderRoom() : null
  );
}
