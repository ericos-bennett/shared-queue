import { Request, Response } from 'express';
import { 
  getAuthUrl, setCredentials, refreshSession,
  addPlaylist, getPlaylist, deleteTrackSpotify, addTrackSpotify,
  getSpotifyTracks 
} from '../services';

/*--------------------
-- Auth Controllers --
--------------------*/
// add these for other cookies for production
const cookieOptions = {
  httpOnly: true,
  secure: true
};

const getAuthCode = (req: Request, res: Response): void => {
  const authUrl: string = getAuthUrl();
  res.send(authUrl);
};

const authenticateUser = async (req: Request, res: Response): Promise<void> => {
  
  const code = req.query.code as string;
  // TODO: check state against cookie for extra security
  // const state = req.query.state as string;

  try {

    const credentials = await setCredentials(code);
    
    if (credentials) {
      const { userId, accessToken, refreshToken, expiration } = credentials;
      res.cookie('userId', userId);
      res.cookie('accessToken', accessToken);
      res.cookie('refreshToken', refreshToken, cookieOptions);
      res.cookie('expiration', expiration, cookieOptions);
      res.redirect(process.env.ROOT_URL!);
    }
    
  } catch (error) {
    console.log(error);
  }

};

/*--------------------
-- Room Controllers --
--------------------*/
const createRoom = async (req: Request, res: Response): Promise<void> => {
  
  const name: string = req.body.name;
  
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;
  const expiration: number = req.cookies.expiration;

  try {
    // If access token has expired, refresh it
    if (expiration < Date.now()) {
      const { newAccessToken, newExpiration } = await refreshSession(refreshToken);
      res.cookie('accessToken', newAccessToken);
      res.cookie('expiration', newExpiration, cookieOptions);
    }
    const playlist = await addPlaylist(name, accessToken);
    res.send(playlist && playlist.body.id);
  } catch (error) {
    console.log(error);
  }

};

const getRoom = async (req: Request, res: Response): Promise<void> => {

  const playlistId: string = req.params.id;

  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;
  const expiration: number = req.cookies.expiration;

  try {
    // If access token has expired, refresh it
    if (expiration < Date.now()) {
      const { newAccessToken, newExpiration } = await refreshSession(refreshToken);
      res.cookie('accessToken', newAccessToken);
      res.cookie('expiration', newExpiration, cookieOptions);
    }
    const playlist = await getPlaylist(playlistId, accessToken);
    res.send(playlist);
  } catch (error) {
    console.log(error);
  }

};

const deleteTrack = async (req: Request, res: Response): Promise<void> => {

  const playlistId: string = req.params.playlistId;
  const index: string = req.params.index;
  const snapshotId: string = req.body.snapshotId;

  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;
  const expiration: number = req.cookies.expiration;

  try {
    // If access token has expired, refresh it
    if (expiration < Date.now()) {
      const { newAccessToken, newExpiration } = await refreshSession(refreshToken);
      res.cookie('accessToken', newAccessToken);
      res.cookie('expiration', newExpiration, cookieOptions);
    }
    const response = await deleteTrackSpotify(playlistId, parseInt(index), snapshotId, accessToken);
    res.send(response);
  } catch (error) {
    console.log(error);
  }

};

const addTrack = async (req: Request, res: Response): Promise<void> => {

  const playlistId: string = req.params.playlistId;
  const trackId: string = req.body.trackId;

  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;
  const expiration: number = req.cookies.expiration;

  try {
    // If access token has expired, refresh it
    if (expiration < Date.now()) {
      const { newAccessToken, newExpiration } = await refreshSession(refreshToken);
      res.cookie('accessToken', newAccessToken);
      res.cookie('expiration', newExpiration, cookieOptions);
    }
    const response = await addTrackSpotify(playlistId, trackId, accessToken);
    res.send(response);
  } catch (error) {
    console.log(error);
  }

};

/*---------------------
-- Search Controllers --
---------------------*/

const searchTrack = async (req: Request, res: Response): Promise<void> => {

  const query: string = req.params.query;

  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;
  const expiration: number = req.cookies.expiration;

  try {
    // If access token has expired, refresh it
    if (expiration < Date.now()) {
      const { newAccessToken, newExpiration } = await refreshSession(refreshToken);
      res.cookie('accessToken', newAccessToken);
      res.cookie('expiration', newExpiration, cookieOptions);
    }
    const tracks = await getSpotifyTracks(query, accessToken);
    res.send(tracks);
  } catch (error) {
    console.log(error);
  }

};

export { 
  getAuthCode, authenticateUser, 
  createRoom, getRoom, deleteTrack, addTrack,
  searchTrack 
};
