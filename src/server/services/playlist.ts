import SpotifyWebApi from 'spotify-web-api-node';

const addPlaylist = async (name: string, accessToken: string, refreshToken: string): Promise<String> => {

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'http://localhost:3000';

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });

  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);

  const response = await spotifyApi.createPlaylist(name);
  
  return response.body.id;

}

const getPlaylist = async (id: string, accessToken: string, refreshToken: string) => {

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'http://localhost:3000';

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });

  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);

  try {
    const playlist = await spotifyApi.getPlaylist(id);
    return playlist;
  } catch (err) {
    console.log('Bad Playlist Lookup OR access token expired');
    return null;
  }

}

const deleteTrackSpotify = async (playlistId: string, index: number, snapshotId: string, accessToken: string, refreshToken: string) => {

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'http://localhost:3000';

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });

  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);

  const response = await spotifyApi.removeTracksFromPlaylistByPosition(playlistId, [index], snapshotId)
  return response;
};

const addTrackSpotify = async (playlistId: string, trackId: string, accessToken: string, refreshToken: string) => {
  
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'http://localhost:3000';

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });

  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);

  const trackArr = [`spotify:track:${trackId}`];

  const response = await spotifyApi.addTracksToPlaylist(playlistId, trackArr);
  console.log(response);
  return response;

};

export { addPlaylist, getPlaylist, deleteTrackSpotify, addTrackSpotify }