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


export { getAuthUrl };
