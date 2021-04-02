import { Request, Response } from 'express';
import { getAuthUrl, setAuthTokens, addPlaylist } from '../services';

const getAuthCode = (req: Request, res: Response): void => {
  const authUrl: string = getAuthUrl();
  res.send(authUrl);
};

const getAuthToken = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string;
  // const state = req.query.state as string;

  const { userId, accessToken, refreshToken } = await setAuthTokens(code);
  
  res.cookie('userId', userId);
  res.cookie('accessToken', accessToken);
  res.cookie('refreshToken', refreshToken);

  res.redirect('http://localhost:3000');
}

const createRoom = async (req: Request, res: Response): Promise<void> => {
  
  if (!req.cookies.userId) {
    res.status(401).send('user not signed in');
    return;
  }
  
  const name: string = req.body.name;
  const accessToken: string = req.cookies.accessToken;
  const refreshToken: string = req.cookies.refreshToken;

  const id = await addPlaylist(name, accessToken, refreshToken);

  res.send(id);

};

export { getAuthCode, getAuthToken, createRoom };
