import { createSpotifyApi } from '../utils';

const getSpotifyTracks = async (query: string, accessToken: string, refreshToken: string) => {

  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
  
  try {
    const res = await spotifyApi.searchTracks(query, {limit: 5});
    return res.body.tracks?.items;
  } catch (error) {
    return null;
  }

};

export { getSpotifyTracks };
