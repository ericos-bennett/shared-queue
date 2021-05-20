const getAuthUrl = (spotifyApi: any): string => {
  // https://developer.spotify.com/documentation/general/guides/scopes/
  const scopes: string[] = [
    'streaming', // For the Web Playback SDK
    'user-read-email', // For the Web Playback SDK
    'user-read-private', // For the Web Playback SDK
    'user-read-playback-state', // Get the User's Currently Playing Track
  ];
  const state = 'some-state-of-my-choice'; // Implement security here

  return spotifyApi.createAuthorizeURL(scopes, state);
};



type refreshedCredentials = {
  newAccessToken: string;
  newExpiration: number;
};

const refreshSession = async (spotifyApi: any): Promise<refreshedCredentials> => {
  spotifyApi.setRefreshToken();

  const response = await spotifyApi.refreshAccessToken();
  const newAccessToken = response.body['access_token'];
  const newExpiration = Date.now() + response.body['expires_in'] * 1000;

  return { newAccessToken, newExpiration };
};

export { getAuthUrl, refreshSession };
