import SpotifyWebApi from 'spotify-web-api-node';

const getAuthUrl = (): string => {

  const scopes: string[] = ['playlist-modify-private'];
  const state: string = 'some-state-of-my-choice';
  
  const clientId: string = process.env.CLIENT_ID!;
  const clientSecret: string = process.env.CLIENT_SECRET!;
  const redirectUri: string = 'http://localhost:8080/api/auth/token';
  
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
  const redirectUri: string = 'http://localhost:3000';

  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
  });

  const response = await spotifyApi.authorizationCodeGrant(code)

  console.log(response.body);
  
  // Set the access token on the API object to use it in later calls
  spotifyApi.setAccessToken(response.body['access_token']);
  spotifyApi.setRefreshToken(response.body['refresh_token']);

};


export { getAuthUrl, setAuthTokens };
