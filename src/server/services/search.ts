import SpotifyWebApi from 'spotify-web-api-node';

const getSpotifyTracks = async (query: string, accessToken: string, refreshToken: string): Promise<SpotifyApi.TrackObjectFull[] | null | undefined> => {

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
    const res = await spotifyApi.searchTracks(query, {limit: 5});
    const tracks = res.body.tracks?.items;
    return tracks;
  } catch (error) {
    console.log(error);
    return null;
  }

}

export { getSpotifyTracks };