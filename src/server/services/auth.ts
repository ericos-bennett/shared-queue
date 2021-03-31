import SpotifyWebApi from 'spotify-web-api-node';

const getAuthUrl = (): string => {

  const scopes: string[] = ['playlist-modify-private'];
  const state: string = 'some-state-of-my-choice';
  
  const clientId: string = process.env.CLIENT_ID!;
  const clientSecret: string = process.env.CLIENT_SECRET!;
  const redirectUri: string = 'http://localhost:3000/api/auth/code';
  
  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
  });
  
  const authorizeURL: string = spotifyApi.createAuthorizeURL(scopes, state);
  return authorizeURL;

};

export { getAuthUrl };