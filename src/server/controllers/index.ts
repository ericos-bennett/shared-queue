import { Request, Response } from 'express';

const createRoom = (req: Request, res: Response) => {
  res.send('Create room');
}

export { createRoom };