import Router from '@koa/router';

import { UserController } from '../controllers/user.controller';
import {
  CreateUserDto,
  UpdateUserDto,
  UpdateUserUsdBalanceDto,
  UpdateUserZoidBalanceDto,
} from '../dto/user.dto';
import { validationBodyMiddleware } from '../middlewares';

const router = new Router();
const userController = new UserController();

export default router
  .post(
    `/users`,
    validationBodyMiddleware(CreateUserDto),
    userController.create.bind(userController),
  )
  .get(`/users/:id`, userController.get.bind(userController))
  .put(
    `/users/:id`,
    validationBodyMiddleware(UpdateUserDto),
    userController.put.bind(userController),
  )
  .post(
    `/users/:id/usd`,
    validationBodyMiddleware(UpdateUserUsdBalanceDto),
    userController.changeUsdBalance.bind(userController),
  )
  .post(
    `/users/:id/zoids`,
    validationBodyMiddleware(UpdateUserZoidBalanceDto),
    userController.changeZoidsBalance.bind(userController),
  )
  .get(`/users/:id/balance`, userController.getBalance.bind(userController));
