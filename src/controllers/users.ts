import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import logger from '@src/logger';
import { authMiddleware } from '@src/middlewares/auth';
import { User } from '@src/models/user';
import AuthService from '@src/services/auth';
import { Request, Response } from 'express';
import { BaseController } from '.';

@Controller('users')
export class UsersController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      const result = await user.save();

      res.status(201).send(result);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return this.sendErrorResponse(res, {
          code: 401,
          message: 'User not found!',
          description: 'Try verifying your email address.',
        });
      }
      if (!(await AuthService.comparePasswords(password, user.password))) {
        return this.sendErrorResponse(res, {
          code: 401,
          message: 'Password does not match!',
        });
      }

      const token = AuthService.generateToken(user.id);
      return res.status(200).send({ token });
    } catch (error) {
      logger.error(error);
      this.sendCreateUpdateErrorResponse(res, error);
      return;
    }
  }

  @Get('me')
  @Middleware(authMiddleware)
  public async me(req: Request, res: Response): Promise<Response> {
    const userId = req.context?.userId;
    const user = await User.findOne({ _id: userId }, { password: 0 });
    if (!user) {
      return this.sendErrorResponse(res, {
        code: 404,
        message: 'User not found!',
      });
    }
    return res.send({ user });
  }
}
