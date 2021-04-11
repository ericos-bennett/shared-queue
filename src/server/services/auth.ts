import { createSpotifyApi } from '../utils';

const getAuthUrl = (): string => {

  const spotifyApi = createSpotifyApi();

  const scopes: string[] = ['playlist-modify-private, playlist-modify-public'];
  const state = 'some-state-of-my-choice'; // Implement security here
  
  return spotifyApi.createAuthorizeURL(scopes, state);

};

type Credentials = {
  userId: string,
  accessToken: string,
  refreshToken: string
};

const setCredentials = async (code: string): Promise<Credentials | undefined> => {

  const spotifyApi = createSpotifyApi();

  try {

    const response = await spotifyApi.authorizationCodeGrant(code);
    const accessToken: string = response.body['access_token'];
    const refreshToken: string = response.body['refresh_token'];
  
    spotifyApi.setAccessToken(accessToken);
    spotifyApi.setRefreshToken(refreshToken);
    
    const user = await spotifyApi.getMe();
    const userId: string = user.body['id'];
    
    return { userId, accessToken, refreshToken };
    
  } catch (error) {
    console.log(error);
  }

};

export { getAuthUrl, setCredentials };
