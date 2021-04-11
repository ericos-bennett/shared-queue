import { createSpotifyApi } from '../utils';

const addPlaylist = async (name: string, accessToken: string) => {

  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    return await spotifyApi.createPlaylist(name);
  } catch (error) {
    console.log(error);
  }

}

const getPlaylist = async (id: string, accessToken: string) => {

  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    return await spotifyApi.getPlaylist(id);
  } catch (error) {
    return null;
  }

};

const deleteTrackSpotify = async (playlistId: string, index: number, snapshotId: string, accessToken: string) => {

  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    return await spotifyApi.removeTracksFromPlaylistByPosition(playlistId, [index], snapshotId)
  } catch (error) {
    console.log(error);
  }

};

const addTrackSpotify = async (playlistId: string, trackId: string, accessToken: string) => {
  
  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(accessToken);

  const tracksArray = [`spotify:track:${trackId}`];

  try {
    return await spotifyApi.addTracksToPlaylist(playlistId, tracksArray);
  } catch (error) {
    console.log(error);
  }

};

export { addPlaylist, getPlaylist, deleteTrackSpotify, addTrackSpotify };
