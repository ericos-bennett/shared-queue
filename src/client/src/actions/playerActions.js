import types from '../reducers/types'
import io from 'socket.io-client';

let ws = null
const ENDPOINT = 'http://localhost:8080'

const setWS = (state, dispatch) => {
    if (!ws && state.roomId) {

        ws = io(ENDPOINT, { transports: ["websocket", "polling"] });
        ws.on('connect', () => {
            ws.emit('joinRoom', state.roomId);
        });
        ws.on('togglePlay', () => {
            console.log('togglePlay from peer');
        });
        ws.on('changeTrack', (number) => {
            console.log('changeTrack Test')
            // playerActions.changeTrack(state, dispatch, number)
        });
        ws.on('play', () => {
            console.log('play from peer');
        });
        ws.on('pause', () => {
            console.log('pause from peer');
        });
    }
}


const pause = (state, dispatch) => {
    const { spotifyPlayer, currentTrackIndex } = state

    spotifyPlayer
        .pause()
        .then(() => {
            dispatch({
                type: types.PAUSE,
                payload: { isPlaying: false, currentTrackIndex }
            })
            setWS(state, dispatch) && ws.emit('pause', state.roomId);
        })
}

const play = (state, dispatch) => {
    const { spotifyPlayer, tracks, currentTrackIndex, roomId } = state
    if (state.isPlaying) {
        return
    } else if (!tracks) {
        alert("No tracks to play")
        return
    } else if (currentTrackIndex > tracks.length) {
        throw new Error(`Track ${currentTrackIndex} is not in track array`)
    } else if (currentTrackIndex === -1) {
        setWS(state, dispatch) && ws.emit('changeTrack', roomId, 0)
        changeTrack(state, dispatch, { direction: 0 })
        return
    }

    const currentTrackId = tracks[currentTrackIndex].id;
    spotifyPlayer
        .togglePlay({
            uris: [`spotify:track:${currentTrackId}`],
        })
        .then(() => {
        dispatch({
            type: types.PLAY,
                payload: { isPlaying: true, currentTrackIndex }
        })
    })
}

const changeTrack = (state, dispatch, payload) => {
    const { direction } = payload
    const { currentTrackIndex, tracks, roomId } = state

    let newTrackIndex = -1
    switch (direction) {
        case 'prev':
            newTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : currentTrackIndex
            break;
        case 'next':
            newTrackIndex = currentTrackIndex <= tracks.length - 1 ? currentTrackIndex + 1 : currentTrackIndex
            break;
        default:
            newTrackIndex = typeof direction === 'number' && direction <= tracks.length ? direction : -1
            break;
    }

    if (newTrackIndex !== -1 && newTrackIndex !== state.currentTrackIndex) {
        dispatch({
            type: types.CHANGE_TRACK,
            payload: { newTrackIndex, isPlaying: true }
        })
        setWS(state, dispatch) && ws.emit('play', roomId);
    } else {
        throw new Error(`Unable to change track to ${direction}`)
    }
}

const deleteTrack = (state, dispatch, payload) => {
    const { trackIndex } = payload
    const { tracks, currentTrackIndex } = state;
    tracks.splice(trackIndex, 1);

    const cti = trackIndex < currentTrackIndex ? currentTrackIndex - 1 : currentTrackIndex

    dispatch({
        type: types.DELETE_TRACK,
        payload: { tracks, currentTrackIndex: cti }
    })
    setWS(state, dispatch) && ws.emit('deleteTrack', state.roomId, trackIndex);
}

const addTrack = (state, dispatch, track) => {
    const { roomId } = state;
    dispatch({
        type: types.ADD_TRACK,
        payload: { track }
    })
    setWS(state, dispatch) && ws.emit('addTrack', roomId, track);
}

export const playerActions = {
    setWS,
    pause,
    play,
    changeTrack,
    deleteTrack,
    addTrack
}


