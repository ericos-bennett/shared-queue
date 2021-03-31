import { Request, Response } from 'express';
import { getAuthUrl, setAuthTokens } from '../services';

const getAuthCode = (req: Request, res: Response) => {
  const authUrl: string = getAuthUrl();
  res.send(authUrl);
};

const getAuthTokens = async (req: Request, res: Response) => {
  const { code, state } = req.query;
  console.log('Code: ', code);
  await setAuthTokens(code);
  res.send('You made it!');
};

export { getAuthCode, getAuthTokens };
