import { Router } from 'express';
import {
  setCookieRefreshToken,
  signRefreshToken,
  signToken,
  verifyRefreshToken,
} from '../auth-tokens';
import { User } from '../entity/User';

const router = Router();

router.post('/api/refresh-token', async (req, res) => {
  const token = req.cookies.john;
  if (!token) return res.json({ ok: false, token: '' });
  try {
    // verify refresh token
    const { userId, version } = verifyRefreshToken(token);
    // verify user
    const user = await User.findOne({ where: { id: userId } });
    if (!user) throw new Error('user not found');
    // verify token version

    if (version !== user.tokenVersion)
      throw new Error('token version not valid');
    //generate new refreshtoken
    setCookieRefreshToken(res, signRefreshToken(user));
    // send new access token
    return res.json({ ok: true, token: signToken(user) });
  } catch (error) {
    console.log(error);
    return res.json({ ok: false, token: '' });
  }
});

export default router;
