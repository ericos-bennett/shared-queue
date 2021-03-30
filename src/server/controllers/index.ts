import { Request, Response } from 'express';
import { getAuthorizeUrl } from '../services';
import axios from 'axios';

const createRoom = async (req: Request, res: Response) => {
  const authorizeUrl: string = getAuthorizeUrl();
  const response: string = await axios.get(authorizeUrl);
  res.send(authorizeUrl)
}

export { createRoom };