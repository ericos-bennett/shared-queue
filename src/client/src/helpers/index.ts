import SpotifyWebApi from 'spotify-web-api-node';

import { Track, PlaylistPositions } from '../../types';

const getCurrentTrackIndex = (
  tracks: Track[],
  currentTrack: string
): number => {
  for (let i = 0; i < tracks.length; i++) {
    if (tracks[i].id === currentTrack) return i;
  }
  return -1;
};

const getPositionInPlaylist = (
  tracks: Track[],
  currentTrack: string
): PlaylistPositions => {
  if (tracks.length === 0) return 'empty';
  if (getCurrentTrackIndex(tracks, currentTrack) === -1) return 'deleted';
  if (getCurrentTrackIndex(tracks, currentTrack) === 0 && tracks.length === 1)
    return 'only';
  if (getCurrentTrackIndex(tracks, currentTrack) === 0) return 'start';
  if (getCurrentTrackIndex(tracks, currentTrack) === tracks.length - 1)
    return 'end';
  return 'middle';
};

const seek = (accessToken: string, progressMs: number): Promise<void> => {
  const spotifyApi = new SpotifyWebApi({});
  spotifyApi.setAccessToken(accessToken);

  return spotifyApi
    .seek(progressMs)
    .then(() => {
      console.log('Seek to ' + progressMs);
    })
    .catch(err => console.log(err));
};

export { getCurrentTrackIndex, getPositionInPlaylist, seek };
