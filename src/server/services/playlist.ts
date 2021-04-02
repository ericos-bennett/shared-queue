import SpotifyWebApi from 'spotify-web-api-node';

const addPlaylist = async (name: string, accessToken: string, refreshToken: string): Promise<String> => {

  const clientId: string = process.env.CLIENT_ID!;
  const clientSecret: string = process.env.CLIENT_SECRET!;
  const redirectUri: string = 'http://localhost:3000';

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

export { addPlaylist }