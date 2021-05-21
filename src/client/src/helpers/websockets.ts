import io from 'socket.io-client';
import { playerActions } from '../actions/playerActions';
import { Track } from '../../types'

let ws: SocketIOClient.Socket;
const ENDPOINT = 'http://localhost:8080';

const setWS = (state: any, dispatch: any) => {
    console.info('setWS');
    if (!ws && state.roomId) {
        ws = io(ENDPOINT, { transports: ['websocket', 'polling'] });
        ws.on('connect', () => {
            ws.emit('joinRoom', state.roomId);
        });
        ws.on('togglePlay', () => {
            console.log('togglePlay from peer');
        });
        ws.on('changeTrack', (number: number) => {
            console.log('changeTrack Test');
            playerActions.changeTrack(state, dispatch, number)
        });
        ws.on('play', () => {
            console.log('play from peer');
        });
        ws.on('pause', () => {
            console.log('pause from peer');
        });
    }
};

const pause = (roomId: string) => {
    ws.emit('pause', roomId);
};

const play = (roomId: string) => {
    ws.emit('play', roomId);
};

const changeTrack = (roomId: string, trackIndex: number) => {
    ws.emit('changeTrack', roomId, trackIndex);
};

const deleteTrack = (roomId: string, trackIndex: number) => {
    ws.emit('deleteTrack', roomId, trackIndex);
};


const addTrack = (roomId: string, track: Track) => {
    ws.emit('addTrack', roomId, track);
};

export const websockets = {
    setWS,
    pause,
    play,
    changeTrack,
    deleteTrack,
    addTrack,
};
