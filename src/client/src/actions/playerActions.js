import { types } from '../reducers/actionTypes';
import { appActions } from './appActions';

const updateRoomState = (state, dispatch, roomState) => {
  // console.info('updateRoomState');
  const { tracks, currentTrackPosition, isPlaying, currentTrackIndex } = state;
  tracks !== roomState.tracks &&
    dispatch({
      type: types.SET_TRACKS,
      payload: roomState.tracks
    });

  currentTrackPosition === 0 &&
    dispatch({
      type: types.SET_TRACK_POSITION,
      payload: roomState.currentTrackPosition
    });

  isPlaying !== roomState.isPlaying &&
    dispatch({
      type: types.PLAY,
      payload: { isPlaying: roomState.isPlaying },
    });

  currentTrackIndex !== roomState.currentTrackIndex &&
    changeTrack(state, dispatch, roomState.currentTrackIndex)
};

const updateCurrentTrackPostion = (state, dispatch, pos) => {
  // console.info('updateCurrentTrackPostion');

  dispatch({
    type: types.SET_TRACK_POSITION,
    payload: pos
  });
};

const setCurrentTrackPostion = (state, dispatch, pos) => {
  // console.info('updateCurrentTrackPostion');
  if (state.spotifyPlayer) {
    console.log(`pos`, pos)
    state.spotifyPlayer.seek(pos).then(() => {
      dispatch({
        type: types.SET_TRACK_POSITION,
        payload: pos
      });
    })
  } else {
    appActions.setSpotifyPlayer(state, dispatch).then(() => {
      state.spotifyPlayer.seek(pos).then(() => {
        dispatch({
          type: types.SET_TRACK_POSITION,
          payload: pos
        });
      })
    })
  }
};


const pause = (state, dispatch) => {
  // console.info('pause');
  const { spotifyPlayer, spotifyPlayerReady, isPlaying } = state;
  spotifyPlayerReady && isPlaying &&
    spotifyPlayer.pause().then(() => {
      dispatch({
        type: types.PAUSE,
        payload: { isPlaying: false },
      });
      updateCurrentTrackPostion(state, dispatch, spotifyPlayer.getCurrentState().position)
    });
};


const startPlayback = (state, dispatch, trackIndex, pos) => {
  // console.info('startPlayback');
  const { tracks, deviceId, spotifyApi } = state;
  // Start/Resume a User's Playback 
  spotifyApi.play({ device_id: deviceId, uris: [`spotify:track:${tracks[trackIndex].id}`], position_ms: pos })
    .then(function () {
      console.log('Playback started');
      dispatch({
        type: types.PLAY,
        payload: { isPlaying: true },
      });
    }, function (err) {
      //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
      console.log('Something went wrong!', err);
    });
  return;
}

const play = (state, dispatch) => {
  // console.info('Play');
  const { tracks, currentTrackIndex, spotifyPlayer, deviceId, spotifyApi } = state;
  if (!tracks) {
    alert('No tracks to play');
    return;
  } else if (currentTrackIndex > tracks.length) {
    throw new Error(`Track ${currentTrackIndex} is not in track array`);
  } else if (currentTrackIndex === -1) {
    if (tracks.length > 0) {
      changeTrack(state, dispatch, 0);
      playerActions.pause(state, dispatch)
    } else {
      return
    }
  }

  // Check if player is the current device
  spotifyPlayer && spotifyPlayer.getCurrentState().then(s => {
    if (!s) {
      // Transfer a User's Playback
      spotifyApi.transferMyPlayback([deviceId])
        .then(function () {
          console.log('Transfering playback to ' + deviceId);
          startPlayback(state, dispatch, 0)
        }, function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log('Something went wrong!', err);
        });
    } else {
      // Return the current play position
      startPlayback(state, dispatch, currentTrackIndex, state.currentTrackPosition)
    }
  })

};

const changeTrack = (state, dispatch, trackIndex) => {
  // console.info('changeTrack:', trackIndex);
  const { isPlaying } = state
  if (trackIndex !== -1) {

    dispatch({
      type: types.CHANGE_TRACK,
      payload: trackIndex,
    });

    isPlaying && startPlayback(state, dispatch, trackIndex, 0)


  } else {
    isPlaying && pause(state, dispatch)
    // throw new Error(`Unable to change track to index ${trackIndex}`);
  }
};

const deleteTrack = (state, dispatch, trackIndex) => {
  // console.info('deleteTrack:', trackIndex);
  const { currentTrackIndex, tracks } = state;

  // If the currently playing track was deleted
  if (trackIndex === currentTrackIndex) {
    if (tracks.length === 1) {
      // If there are no tracks to play
      changeTrack(state, dispatch, -1)
    } else if (trackIndex >= tracks.length - 1) {
      // If the last track was deleted, set current track to end of array
      changeTrack(state, dispatch, trackIndex - 1)
      // state.isPlaying && startPlayback(state, dispatch, trackIndex, 0)
    } else {
      // restart playing new current track
      changeTrack(state, dispatch, trackIndex)
      // state.isPlaying && startPlayback(state, dispatch, trackIndex, 0)
    }
  }
  dispatch({
    type: types.DELETE_TRACK,
    payload: { trackIndex },
  });
};

const addTrack = (state, dispatch, track) => {
  dispatch({
    type: types.ADD_TRACK,
    payload: track,
  });
  if (state.currentTrackIndex === -1) {
    playerActions.changeTrack(state, dispatch, 0)
  }
};

const checkSpotifyPlayerExists = async (state, dispatch) => {
  try {
    state.spotifyPlayer.getCurrentState().then((s) => {
      return true
    })
  } catch (error) {
    appActions.setSpotifyPlayer(state, dispatch)
    return true
  }
};

const setVolume = async (state, dispatch, vol) => {
  try {
    state.spotifyPlayer.setVolume(vol).then(() => {
      return true
    })
  } catch (error) {
    console.log(error)
    return false
  }
};

const getVolume = async (state, dispatch, vol) => {
  try {
    state.spotifyPlayer.getVolume().then((vol) => {
      return !vol ? 1 : vol
      // return vol || 0
    })
  } catch (error) {
    console.log(error)
    return 0
  }
};

export const playerActions = {
  updateRoomState,
  pause,
  play,
  changeTrack,
  deleteTrack,
  addTrack,
  setCurrentTrackPostion,
  updateCurrentTrackPostion,
  checkSpotifyPlayerExists,
  setVolume,
  getVolume,
};
