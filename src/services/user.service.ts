import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserUsdBalanceDto,
  UpdateUserZoidBalanceDto,
} from '../dto/user.dto';
import { User, UserBalance, UserUsdBalanceAction, UserZoidBalanceAction } from '../interfaces';
import { getISODate, multiply, subtract, sum } from '../util';
import { logger } from '../util/logger';
import { v4, validate } from 'uuid';
import { BadRequestException, NotFoundException } from '../exceptions';
import zoidServiceInstance, { ZoidService } from './zoid.service';
import { plainToInstance } from 'class-transformer';

export class UserService {
  private users: User[] = [];

  constructor(private readonly zoidService: ZoidService = zoidServiceInstance) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    logger.verbose('create user', dto);

    const user: User = {
      ...plainToInstance(CreateUserDto, dto),
      id: v4(),
      zoidAmount: 0,
      usdBalance: 0,
      createdAt: getISODate(),
      updatedAt: getISODate(),
    };

    this.users.push(user);

    logger.verbose('user created');
    return user;
  }

  async getUserById(id: string): Promise<User> {
    if (!validate(id)) {
      throw new BadRequestException('User "id" must be a valid UUID string');
    }

    logger.verbose('get user', { id });

    const user = this.users.find((user) => {
      return user.id === id;
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUser(id: string, { name: rawName, email: rawEmail }: UpdateUserDto): Promise<User> {
    logger.verbose('update user');

    const user = await this.getUserById(id);
    const name = rawName && rawName.trim();
    const email = rawEmail && rawEmail.trim();
    const nameChanged = name && name !== user.name;
    const emailChanged = email && email !== user.email;
    if (nameChanged) {
      user.name = name;
    }

    if (emailChanged) {
      user.email = email;
    }

    if (nameChanged || emailChanged) {
      user.updatedAt = getISODate();

      logger.verbose('user updated');
    }

    return user;
  }

  async updateUserUsdBalance(
    id: string,
    { action, amount }: UpdateUserUsdBalanceDto,
  ): Promise<User> {
    logger.verbose('update user USD balance', { action, amount });

    const user = await this.getUserById(id);

    switch (action) {
      case UserUsdBalanceAction.WITHDRAW:
        const currentUsdBalance = user.usdBalance;
        if (currentUsdBalance - amount < 0) {
          throw new BadRequestException(`Not enough money on USD balance to withdraw`);
        }
        user.usdBalance = subtract(user.usdBalance, amount);
        break;
      case UserUsdBalanceAction.DEPOSIT:
        user.usdBalance = sum(user.usdBalance, amount);
        break;
      default:
        throw new BadRequestException(`Unknown action "${action}" on changing USD balance`);
    }

    user.updatedAt = getISODate();

    logger.verbose('user USD balance updated');
    return user;
  }

  async updateUserZoidBalance(
    id: string,
    { action, amount }: UpdateUserZoidBalanceDto,
  ): Promise<User> {
    logger.verbose('update user Zoid balance', { action, amount });

    const user = await this.getUserById(id);
    const zoidPrice = await this.zoidService.getPrice();
    const zoidAmountPrice = multiply(amount, zoidPrice);
    const { usdBalance, zoidAmount } = user;

    switch (action) {
      case UserZoidBalanceAction.BUY:
        if (usdBalance - zoidAmountPrice < 0) {
          throw new BadRequestException(`Not enough money on USD balance to buy Zoids`);
        }
        user.usdBalance = subtract(usdBalance, zoidAmountPrice);
        user.zoidAmount = sum(zoidAmount, amount);
        break;
      case UserZoidBalanceAction.SELL:
        if (zoidAmount - amount < 0) {
          throw new BadRequestException(`Not enough money on Zoid balance to sell`);
        }
        user.usdBalance = sum(usdBalance, zoidAmountPrice);
        user.zoidAmount = subtract(zoidAmount, amount);
        break;
      default:
        throw new BadRequestException(`Unknown action "${action}" on changing Zoid balance`);
    }

    user.updatedAt = getISODate();

    logger.verbose('user Zoid balance updated');
    return user;
  }

  async getUserBalance(id: string): Promise<UserBalance> {
    logger.verbose('get user balance');

    const { usdBalance, zoidAmount } = await this.getUserById(id);
    const zoidPrice = await this.zoidService.getPrice();
    const fullUsdBalance = usdBalance + multiply(zoidAmount, zoidPrice);
    return {
      balance: fullUsdBalance,
    };
  }
}
