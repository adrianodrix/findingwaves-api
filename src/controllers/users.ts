import { Controller, Post } from '@overnightjs/core';
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
      this.sendCreatedUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(
    req: Request,
    res: Response
  ): Promise<Response | undefined> {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({
        code: 401,
        error: 'User not found!',
      });
    }
    if (!(await AuthService.comparePasswords(password, user.password))) {
      return res.status(401).send({
        code: 401,
        error: 'Credentials invalid!',
      });
    }

    const token = AuthService.generateToken(user.toJSON());
    return res.status(200).send({ token });
  }
}
