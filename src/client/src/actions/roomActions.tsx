import types from '../reducers/types'
import { playerActions } from '../actions/playerActions';
import { sdkErrorMessage } from '../../types';
import Cookie from 'js-cookie';
import io from 'socket.io-client';

let socket: any = null
const ENDPOINT = 'http://localhost:8080'

const setRoomId = (dispatch: any, payload: any) => {
    console.info("setRoomId")
    dispatch({
        type: types.SET_ROOM_ID,
        payload
    })
}


const setSpotifyApi = (dispatch: any, payload: any) => {
    console.info("setSpotifyApi")
    dispatch({
        type: types.SET_SPOTIFY_API,
        payload
    })
}

const setSpotifyPlayer = (state: any, dispatch: any) => {
    console.info("setSpotifyPlayer")
    // Create a new SDK player instance and add listeners to it
    // @ts-ignore
    const spotifyPlayer = new Spotify.Player({
        name: 'Spotify Mix',
        getOAuthToken: (cb: any) => {
            cb(Cookie.get('accessToken'));
        },
    });

    spotifyPlayer.connect().then((success: boolean) => {
        if (success) {
            console.log('The Web Playback SDK successfully connected to Spotify!');
        }
    })

    // Error handling
    spotifyPlayer.addListener('initialization_error', (message: sdkErrorMessage) => { console.error(message); });
    spotifyPlayer.addListener('authentication_error', (message: sdkErrorMessage) => { console.error(message); });
    spotifyPlayer.addListener('account_error', (message: sdkErrorMessage) => { console.error(message); });
    spotifyPlayer.addListener('playback_error', (message: sdkErrorMessage) => { console.error(message); });


    // When the player is ready, set up WS listener and request the current room state
    spotifyPlayer.addListener('ready', ({ device_id }: { device_id: string }) => {
        console.log('SDK connected and deviceId set');

        socket = io(ENDPOINT, { transports: ['websocket', "polling"] });
        socket.on('togglePlay', () => {
            console.log('togglePlay from peer');
        });
        socket.on('changeTrack', (number: number) => {
            console.log('changeTrack Test')
            playerActions.changeTrack(state, dispatch, number)
        });
        socket.on('play', () => {
            console.log('play from peer');
        });
        socket.on('pause', () => {
            console.log('pause from peer');
        });
        socket.on('connect', () => {
            socket.emit('joinRoom', state.roomId);
        });
    });

    spotifyPlayer.addListener('changeTrack', () => {
        console.log('togglePlay from peer');
    });



    dispatch({
        type: types.SET_SPOTIFY_PLAYER,
        payload: spotifyPlayer
    })
}


export const roomActions = {
    setRoomId,
    setSpotifyApi,
    setSpotifyPlayer,
}


