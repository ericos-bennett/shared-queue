import { Request, response, Response } from 'express';
import { getAuthUrl } from '../services';

const getAuthToken = (req: Request, res: Response) => {
  const authUrl: string = getAuthUrl();
  res.send(authUrl);
};

const getAuthCode = (req: Request, res: Response) => {
  console.log(req.body);
  res.send('You made it!');
};

export { getAuthToken, getAuthCode };