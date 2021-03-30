import SpotifyWebApi from 'spotify-web-api-node';
import dotenv from 'dotenv';
dotenv.config();

const getAuthorizationToken = () => {

  const scopes = ['user-read-private', 'user-read-email'];
  const state = 'some-state-of-my-choice';
  
  const clientId = process.env.CLIENT_ID!;
  const clientSecret = process.env.CLIENT_SECRET!;
  const redirectUri = 'https://example.com/callback';
  
  const spotifyApi = new SpotifyWebApi({
    clientId,
    clientSecret,
    redirectUri
  });
  
  // Create the authorization URL
  const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);

  return authorizeURL;

};

export default getAuthorizationToken;