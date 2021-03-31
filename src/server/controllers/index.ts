import { Request, Response } from 'express';
import { getAuthUrl, setAuthTokens, addPlaylist } from '../services';

const getAuthCode = (req: Request, res: Response): void => {
  const authUrl: string = getAuthUrl();
  res.send(authUrl);
};

const getAuthTokens = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  // const state = req.query.state as string;

  const { userId, accessToken, refreshToken } = await setAuthTokens(code);
  
  res.cookie('userId', userId);
  res.cookie('accessToken', accessToken);
  res.cookie('refreshToken', refreshToken);
  res.redirect('http://localhost:3000');
};

const createPlaylist = async (req: Request, res: Response) => {

  if (!req.cookies.userId) return res.status(401).send('user not signed in');
  
  const name: string = req.body.name;
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;

  const body = await addPlaylist(name, accessToken, refreshToken);

  return res.send(body);

};

export { getAuthCode, getAuthTokens, createPlaylist };
