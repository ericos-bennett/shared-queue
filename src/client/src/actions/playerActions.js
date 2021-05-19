import { types } from '../reducers/actionTypes';


const pause = (state, dispatch) => {
  console.info('pause');
  const { spotifyPlayer, roomId } = state;
  state.spotifyPlayerReady &&
    spotifyPlayer.pause().then(() => {
      dispatch({
        type: types.PAUSE,
        payload: { isPlaying: false },
      });
    });
};


const play = (state, dispatch) => {
  console.info('Play');
  // Remove roomId where it is assigned a value but not used (3 times in this file)
  const { tracks, currentTrackIndex, spotifyPlayer, roomId, deviceId, spotifyApi, playlistId } = state;
  if (state.isPlaying) {
    return;
  } else if (!tracks) {
    alert('No tracks to play');
    return;
  } else if (currentTrackIndex > tracks.length) {
    throw new Error(`Track ${currentTrackIndex} is not in track array`);
  } else if (currentTrackIndex === -1) {
    changeTrack(state, dispatch, { direction: 0 });
    return;
  }

  // Check if player is the current device
  spotifyPlayer.getCurrentState().then(s => {
    if (!s) {

      // Transfer a User's Playback
      spotifyApi.transferMyPlayback([deviceId])
        .then(function () {
          console.log('Transfering playback to ' + deviceId);
        }, function (err) {
          //if the user making the request is non-premium, a 403 FORBIDDEN response code will be returned
          console.log('Something went wrong!', err);
        });

      return 0;
    } else {
      // Return the current play position
      return s.position;
    }
  }).then((pos) => {
    // Start/Resume a User's Playback 
    spotifyApi.play({ context_uri: `spotify:playlist:${playlistId}`, position_ms: pos })
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
  });

};

// I don't think this works correctly yet, for me it changes the track in local state but not the audio playback
const changeTrack = (state, dispatch, payload) => {
  console.info('changeTrack');
  const { direction } = payload;
  const { currentTrackIndex, tracks, roomId } = state;

  let newTrackIndex = -1;
  switch (direction) {
    case 'prev':
      newTrackIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : currentTrackIndex;
      break;
    case 'next':
      newTrackIndex =
        currentTrackIndex <= tracks.length - 1 ? currentTrackIndex + 1 : currentTrackIndex;
      break;
    default:
      newTrackIndex = typeof direction === 'number' && direction <= tracks.length ? direction : -1;
      break;
  }

  if (newTrackIndex === state.currentTrackIndex) {
    return;
  }

  if (newTrackIndex !== -1) {
    dispatch({
      type: types.CHANGE_TRACK,
      payload: newTrackIndex,
    });
    play(state, dispatch);
  } else {
    throw new Error(`Unable to change track to ${direction}`);
  }
};

// For me this is always deleting the first track, not the one with the icon beside it
const deleteTrack = (state, dispatch, trackIndex) => {

  // I think you have to spread here as well, to avoid mutating state in place
  const { currentTrackIndex, spotifyApi, playlistId } = state;

  const cti = trackIndex < currentTrackIndex ? currentTrackIndex - 1 : currentTrackIndex;

  // Get a playlist - Need playlist snapshot
  spotifyApi.getPlaylist(playlistId)
    .then(function (data) {
      console.log('Some information about this playlist', data.body);

      const tracks = [{ uri: `spotify:track:${state.tracks[trackIndex].id}`, positions: [trackIndex] }]

      console.log(`tracks`, tracks)
      // Remove tracks from a playlist at a specific position
      spotifyApi.removeTracksFromPlaylist(playlistId, tracks)
        .then(function (data) {
          console.log('Tracks removed from playlist!');
          dispatch({
            type: types.DELETE_TRACK,
            payload: { trackIndex, currentTrackIndex: cti },
          });
        }, function (err) {
          console.log('Something went wrong!', err);
        });
    }, function (err) {
      console.log('Something went wrong!', err);
    });
};

const addTrack = (state, dispatch, track) => {

  const { spotifyApi, playlistId } = state;
  dispatch({
    type: types.ADD_TRACK,
    payload: track,
  });

  // Add tracks to a playlist
  spotifyApi.addTracksToPlaylist(playlistId, [`spotify:track:${track.id}`])
    .then(function (data) {
      console.log('Added tracks to playlist!');
    }, function (err) {
      // Remove track
      console.log('Something went wrong!', err);
    });

};

export const playerActions = {
  pause,
  play,
  changeTrack,
  deleteTrack,
  addTrack,
};
