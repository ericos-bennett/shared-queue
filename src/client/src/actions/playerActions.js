import types from '../reducers/types'


const pause = (state, dispatch) => {
    const { spotifyApi, ws } = state

    spotifyApi
        .pause()
        .then(() => {
            ws.emit('pause', state.roomId);
            dispatch({
                type: types.PAUSE,
                payload: null
            })
        })
        .catch(err => console.log(err));
}

const play = (state, dispatch) => {
    const { spotifyApi, tracks, trackHasLoaded, currentTrackIndex, currentTrackPosition, ws } = state
    if (trackHasLoaded.current) {
        spotifyApi
            .play()
            .then(() => {
                ws.emit('play', state.roomId);
                dispatch({
                    type: types.PLAY,
                    payload: { isPlaying: false, trackHasLoaded: true }
                })
            })
            .catch(err => console.log(err));
    } else {
        const currentTrackId = tracks[currentTrackIndex].id;
        spotifyApi
            .play({
                uris: [`spotify:track:${currentTrackId}`],
                position_ms: currentTrackPosition,
            })
            .then(() => {
                ws.emit('play', state.roomId);
                dispatch({
                    type: types.PLAY,
                    payload: { isPlaying: true, trackHasLoaded: true }
                })
                console.log('Playback started for the first time');
            })
            .catch(err => console.log(err));
    }
}


const changeTrack = (state, dispatch, payload) => {
    const { direction } = payload
    const { spotifyApi, currentTrackIndex, tracks, ws } = state
    const newTrackIndex =
        direction === 'prev' ? currentTrackIndex - 1 : currentTrackIndex + 1;
    const newTrackId = tracks[newTrackIndex].id;

    spotifyApi
        .play({
            uris: [`spotify:track:${newTrackId}`],
        })
        .then(() => {
            console.log('Track switched');
            ws.emit('changeTrack', state.roomId, direction);
            dispatch({
                type: types.CHANGE_TRACK,
                payload: { currentTrackIndex, isPlaying: true }
            })
        })
        .catch(err => console.log(err));
}

const deleteTrack = (state, dispatch, payload) => {
    const { trackIndex } = payload
    const { tracks, currentTrackIndex, ws } = state;
    tracks.splice(trackIndex, 1);

    const cti = trackIndex < currentTrackIndex ? currentTrackIndex - 1 : currentTrackIndex
    ws.emit('deleteTrack', state.roomId, trackIndex);
    dispatch({
        type: types.DELETE_TRACK,
        payload: { tracks, currentTrackIndex: cti }
    })
}

const addTrack = (state, dispatch, payload) => {
    const { track } = payload;
    const { ws } = state;
    ws.emit('addTrack', state.roomId, track);
    dispatch({
        type: types.ADD_TRACK,
        payload
    })
}



export const playerActions = {

    pause,
    play,
    changeTrack,
    deleteTrack,
    addTrack
}


