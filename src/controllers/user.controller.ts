import { Context } from 'koa';
import { UserService } from '../services/user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserUsdBalanceDto,
  UpdateUserZoidBalanceDto,
} from '../dto/user.dto';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  async create(ctx: Context) {
    const dto = ctx.request.body as CreateUserDto;
    ctx.body = await this.userService.createUser(dto);
    ctx.status = 201;
  }

  async get(ctx: Context) {
    const userId = ctx.params.id;
    ctx.body = await this.userService.getUserById(userId);
  }

  async put(ctx: Context) {
    const userId = ctx.params.id;
    const dto = ctx.request.body as UpdateUserDto;
    ctx.body = await this.userService.updateUser(userId, dto);
  }

  async changeUsdBalance(ctx: Context) {
    const userId = ctx.params.id;
    const dto = ctx.request.body as UpdateUserUsdBalanceDto;
    ctx.body = await this.userService.updateUserUsdBalance(userId, dto);
  }

  async changeZoidsBalance(ctx: Context) {
    const userId = ctx.params.id;
    const dto = ctx.request.body as UpdateUserZoidBalanceDto;
    ctx.body = await this.userService.updateUserZoidBalance(userId, dto);
  }

  async getBalance(ctx: Context) {
    const userId = ctx.params.id;
    ctx.body = await this.userService.getUserBalance(userId);
  }
}
