import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from 'type-graphql';
import { compare, hash } from 'bcryptjs';
import { isAdmin, isAuth } from '../middleware/authentication';
import { User } from '../entity/User';
import { LoginResponse } from '../dto/LoginResponse';
import { Context } from '../interface/Context';
import {
  setCookieRefreshToken,
  signRefreshToken,
  signToken,
} from '../auth-tokens';
import { getConnection } from 'typeorm';
import { Role } from '../entity/Role';

@Resolver()
export class UserResolver {
  @Query(() => [User])
  @UseMiddleware(isAdmin)
  async users() {
    return await User.find();
  }

  @Query(() => User)
  @UseMiddleware(isAuth)
  async myUser(@Ctx() { jwtData }: Context) {
    return await User.findOne({ where: { id: jwtData!.userId } });
  }

  @Mutation(() => Boolean)
  async signup(
    @Arg('username', () => String) username: string,
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string
  ) {
    try {
      // generate password
      const hashPassword = await hash(`${username}^${password}`, 12);
      //insert new user
      const userRole = await Role.findOne({ where: { name: 'user' } });
      if (!userRole) throw new Error('create user role "user"');

      await User.insert({
        username,
        email,
        password: hashPassword,
        role: userRole,
      });
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg('username', () => String, { nullable: true }) username: string,
    @Arg('password', () => String) password: string,
    @Ctx() { res }: Context
  ) {
    // check user
    let user;
    if (username) user = await User.findOne({ where: { username } });
    if (!user) user = await User.findOne({ where: { email: username } });
    if (!user) throw new Error('user not found');
    // check password
    const validate = await compare(
      `${user.username}^${password}`,
      user.password
    );
    if (!validate) throw new Error('password not match');
    // generate refresh token
    setCookieRefreshToken(res, signRefreshToken(user));
    // send new access token
    return {
      token: signToken(user),
    };
  }

  @Mutation(() => Boolean)
  async logout(@Ctx() { res }: Context) {
    try {
      setCookieRefreshToken(res, '');
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAdmin)
  async revokeRefreshToken(@Arg('username', () => String) username: string) {
    try {
      await getConnection()
        .getRepository(User)
        .increment({ username }, 'tokenVersion', 1);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
