import SpotifyWebApi from 'spotify-web-api-node';

const getAuthUrl = (): string => {

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'http://localhost:8080/api/auth/token';

  const scopes: string[] = ['playlist-modify-private, playlist-modify-public'];
  const state = 'some-state-of-my-choice'; // Implement security here
  
  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
  });
  
  return spotifyApi.createAuthorizeURL(scopes, state);

};

const setAuthTokens = async (code: string) => {

  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = 'http://localhost:8080/api/auth/token';

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });

  const response = await spotifyApi.authorizationCodeGrant(code)
  const accessToken: string = response.body['access_token'];
  const refreshToken: string = response.body['refresh_token'];

  // Set the access token on the API object to use it in the user call
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
  
  const user = await spotifyApi.getMe();
  const userId: string = user.body['id'];
  
  return { userId, accessToken, refreshToken };

};

export { getAuthUrl, setAuthTokens };
