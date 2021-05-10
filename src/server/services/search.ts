import { createSpotifyApi } from '../utils';

const getSpotifyTracks = async (query: string, accessToken: string) => {
  const spotifyApi = createSpotifyApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const res = await spotifyApi.searchTracks(query, { limit: 5 });
    return res.body.tracks?.items;
  } catch (error) {
    return null;
  }
};

export { getSpotifyTracks };
