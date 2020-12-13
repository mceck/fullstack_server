import { Context } from '../interface/Context';
import { MiddlewareFn } from 'type-graphql';
import { verifyToken } from '../auth-tokens';

export const isAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const { authorization } = context.req.headers;
  if (!authorization) throw new Error('not authenticated');
  try {
    const token = authorization.split(' ')[1];
    context.jwtData = verifyToken(token);
  } catch (err) {
    console.log(err);
    throw new Error('token not valid');
  }
  return next();
};

export const isAdmin: MiddlewareFn<Context> = ({ context }, next) => {
  const { authorization } = context.req.headers;
  if (!authorization) throw new Error('not authenticated');
  try {
    const token = authorization.split(' ')[1];
    let jwtDecoded;
    try {
      jwtDecoded = verifyToken(token);
    } catch (err) {
      console.log(err);
      throw new Error('token not valid');
    }
    if (jwtDecoded.role !== 'admin')
      throw new Error("user doesn't have right role");
    context.jwtData = jwtDecoded;
  } catch (err) {
    console.log(err);
    throw err;
  }
  return next();
};
