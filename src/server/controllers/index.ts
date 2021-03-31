import { Request, Response } from 'express';
import { getAuthUrl, setAuthTokens } from '../services';

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

export { getAuthCode, getAuthTokens };
