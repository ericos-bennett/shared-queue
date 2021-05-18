import { Request, Response } from 'express';
import { getAuthUrl, setCredentials } from '../services';

/*--------------------
-- Auth Controllers --
--------------------*/
// add these for other cookies for production
const cookieOptions = {
  // httpOnly: true,
  secure: true,
};

const getAuthCode = (req: Request, res: Response): void => {
  console.info('getAuthCode');
  const authUrl: string = getAuthUrl();
  res.send(authUrl);
};

const authenticateUser = async (req: Request, res: Response): Promise<void> => {
  console.info('authenticateUser');
  const code = req.query.code as string;
  // TODO: check state against cookie for extra security
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

export { getAuthCode, authenticateUser };
