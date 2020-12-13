import { Request, Response } from 'express';
import { JwtData } from '../auth-tokens';

export interface Context {
  req: Request;
  res: Response;
  jwtData?: JwtData;
}
