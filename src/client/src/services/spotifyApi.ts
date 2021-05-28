import SpotifyWebApi from './spotify-web-api-node-pkce/server';

const createSpotifyApi = (): SpotifyWebApi => {

  // TODO 
  const clientId = '0e4fbd47ca0c471f83fa9732a77ad6c9' //process.env.CLIENT_ID;
  const redirectUri = 'http://localhost:3000/api/auth/token'//process.env.AUTH_REDIRECT_URI;
  return new SpotifyWebApi({
    clientId,
    redirectUri,
  });
};

export { createSpotifyApi };
