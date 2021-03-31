import SpotifyWebApi from 'spotify-web-api-node';

const getAuthUrl = (): string => {

  const clientId: string = process.env.CLIENT_ID!;
  const clientSecret: string = process.env.CLIENT_SECRET!;
  const redirectUri: string = 'http://localhost:8080/api/auth/token';

  const scopes: string[] = ['playlist-modify-private, playlist-modify-public'];
  const state: string = 'some-state-of-my-choice'; // Implement security here
  
  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
  });
  
  const authorizeURL: string = spotifyApi.createAuthorizeURL(scopes, state);
  return authorizeURL;

};

const setAuthTokens = async (code: string) => {

  const clientId: string = process.env.CLIENT_ID!;
  const clientSecret: string = process.env.CLIENT_SECRET!;
  const redirectUri: string = 'http://localhost:8080/api/auth/token';

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });

  const response = await spotifyApi.authorizationCodeGrant(code)
  const accessToken = response.body['access_token'];
  const refreshToken = response.body['refresh_token'];

  // Set the access token on the API object to use it in the user call
  spotifyApi.setAccessToken(accessToken);
  spotifyApi.setRefreshToken(refreshToken);
  
  const user = await spotifyApi.getMe();
  const userId = user.body['id'];
  
  return { userId, accessToken, refreshToken };

};

export { getAuthUrl, setAuthTokens };
