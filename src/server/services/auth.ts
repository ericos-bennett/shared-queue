import { createSpotifyApi } from '../utils';

const getAuthUrl = (): string => {

  const spotifyApi = createSpotifyApi();

  const scopes: string[] = [
    'playlist-modify-private', 
    'playlist-modify-public', 
    'streaming', 
    'user-read-email', 
    'user-read-private'
  ];
  const state = 'some-state-of-my-choice'; // Implement security here
  
  return spotifyApi.createAuthorizeURL(scopes, state);

};

type Credentials = {
  userId: string,
  accessToken: string,
  refreshToken: string,
  expiration: number
};

const setCredentials = async (code: string): Promise<Credentials | undefined> => {

  const spotifyApi = createSpotifyApi();

  try {

    const response = await spotifyApi.authorizationCodeGrant(code);
    const accessToken: string = response.body['access_token'];
    const refreshToken: string = response.body['refresh_token'];
    const expiration: number = Date.now() + response.body['expires_in']*1000;

    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    
    const user = await spotifyApi.getMe();
    const userId: string = user.body['id'];
    
    return { userId, accessToken, refreshToken, expiration };
    
  } catch (error) {
    console.log(error);
  }

};

type refreshedCredentials = {
  newAccessToken: string,
  newExpiration: number
}

const refreshSession = async (refreshToken: string): Promise<refreshedCredentials> => {
  
  const spotifyApi = createSpotifyApi();
  spotifyApi.setRefreshToken(refreshToken);

  const response = await spotifyApi.refreshAccessToken();
  const newAccessToken = response.body['access_token'];
  const newExpiration = Date.now() + response.body['expires_in']*1000;
  
  return { newAccessToken, newExpiration };
};

export { getAuthUrl, setCredentials, refreshSession };
