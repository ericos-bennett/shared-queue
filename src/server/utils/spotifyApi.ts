import SpotifyWebApi from 'spotify-web-api-node';

const createSpotifyApi = (): SpotifyWebApi => {
  
  const clientId = process.env.CLIENT_ID;
  const clientSecret = process.env.CLIENT_SECRET;
  const redirectUri = process.env.AUTH_REDIRECT_URI;

  return new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri,
  });

};

export { createSpotifyApi };