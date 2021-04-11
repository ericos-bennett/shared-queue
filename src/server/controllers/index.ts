import { Request, Response } from 'express';
import { 
  getAuthUrl, setAuthTokens, 
  addPlaylist, getPlaylist, deleteTrackSpotify, addTrackSpotify,
  getSpotifyTracks 
} from '../services';

/*--------------------
-- Auth Controllers --
--------------------*/
const getAuthCode = (req: Request, res: Response): void => {
  const authUrl: string = getAuthUrl();
  res.send(authUrl);
};

const getAuthToken = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string;
  // TODO: check state against cookie for extra security
  // const state = req.query.state as string;

  const { userId, accessToken, refreshToken } = await setAuthTokens(code);
  
  res.cookie('userId', userId);
  res.cookie('accessToken', accessToken);
  res.cookie('refreshToken', refreshToken);

  res.redirect('http://localhost:3000');
};

/*--------------------
-- Room Controllers --
--------------------*/
const createRoom = async (req: Request, res: Response): Promise<void> => {
  
  if (!req.cookies.userId) {
    res.status(401).send('user not signed in');
    return;
  }
  
  const name: string = req.body.name;
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;

  const id = await addPlaylist(name, accessToken, refreshToken);

  // Return the playlist id to the client after adding it to Spotify
  res.send(id);

};

const getRoom = async (req: Request, res: Response): Promise<void> => {

  const playlistId: string = req.params.id;
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;

  const playlist = await getPlaylist(playlistId, accessToken, refreshToken);
  res.send(playlist);

};

const deleteTrack = async (req: Request, res: Response): Promise<void> => {

  const playlistId: string = req.params.playlistId;
  const index: string = req.params.index;
  const snapshotId: string = req.body.snapshotId;
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;

  const response = await deleteTrackSpotify(playlistId, parseInt(index), snapshotId, accessToken, refreshToken);
  res.send(response);

};

const addTrack = async (req: Request, res: Response): Promise<void> => {

  const playlistId: string = req.params.playlistId;
  const trackId: string = req.body.trackId;
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;

  console.log(playlistId, trackId);

  const response = await addTrackSpotify(playlistId, trackId, accessToken, refreshToken);
  res.send(response);

}

/*---------------------
-- Search Controllers --
---------------------*/

const searchTrack = async (req: Request, res: Response): Promise<void> => {

  const query: string = req.params.query;
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;
  
  const tracks = await getSpotifyTracks(query, accessToken, refreshToken);
  res.send(tracks);

};

export { 
  getAuthCode, getAuthToken, 
  createRoom, getRoom, deleteTrack, addTrack,
  searchTrack 
};
