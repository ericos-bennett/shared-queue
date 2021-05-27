import { types } from '../reducers/actionTypes';

const updateRoomState = (state, dispatch, roomState) => {
  console.info('updateRoomState');
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

const pause = (state, dispatch) => {
  console.info('pause');
  const { spotifyPlayer } = state;
  state.spotifyPlayerReady &&
    spotifyPlayer.pause().then(() => {
      dispatch({
        type: types.PAUSE,
        payload: { isPlaying: false },
      });
    });
};


const startPlayback = (state, dispatch, trackIndex, pos) => {
  console.info('startPlayback');
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
  console.info('Play');
  const { tracks, currentTrackIndex, spotifyPlayer, deviceId, spotifyApi } = state;
  if (!tracks) {
    alert('No tracks to play');
    return;
  } else if (currentTrackIndex > tracks.length) {
    throw new Error(`Track ${currentTrackIndex} is not in track array`);
  } else if (currentTrackIndex === -1) {
    changeTrack(state, dispatch, 0);
    if (state.isPlaying) {
      return;
    }
  }

  // Check if player is the current device
  spotifyPlayer.getCurrentState().then(s => {
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
      startPlayback(state, dispatch, currentTrackIndex, 0)
    }
  })

};

const changeTrack = (state, dispatch, trackIndex) => {
  console.info('changeTrack:', trackIndex);
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
  console.info('deleteTrack:', trackIndex);
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
};


export const playerActions = {
  updateRoomState,
  pause,
  play,
  changeTrack,
  deleteTrack,
  addTrack,
};
