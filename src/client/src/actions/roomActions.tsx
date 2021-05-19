import { types } from '../reducers/actionTypes';

const setRoomId = (dispatch: any, payload: any) => {
  console.info('setRoomId');
  dispatch({
    type: types.SET_ROOM_ID,
    payload,
  });
};


const createPlaylist = ((state: any, dispatch: any, roomName: string) => {
  console.info("createPlaylist")
  const { spotifyApi } = state
  // Create a private playlist
  spotifyApi.createPlaylist(`Spotify Mix Playlist - ${roomName}`, { 'public': true })
    .then(function (data: any) {
      dispatch({
        type: types.CREATE_PLAYLIST,
        payload: data.body
      })

    }, function (err: any) {
      console.log('Something went wrong!', err);
    });
})

// There is no delete playlist with spotify, the best is to unfollow
const unfollowPlaylist = ((state: any, dispatch: any) => {
  console.info("unfollowPlaylist")
  const { spotifyApi, playlistId } = state
  // Unfollow a playlist
  spotifyApi.unfollowPlaylist(playlistId)
    .then(function (data: any) {
      dispatch({
        type: types.UNFOLLOW_PLAYLIST,
        payload: playlistId
      })
      console.log('Playlist successfully unfollowed!');
    }, function (err: any) {
      console.log('Something went wrong!', err);
    });
})

export const roomActions = {
  createPlaylist,
  unfollowPlaylist,
  setRoomId,

};
