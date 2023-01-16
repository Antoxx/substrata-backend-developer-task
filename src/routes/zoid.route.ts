import Router from '@koa/router';
import { ZoidController } from '../controllers/zoid.controller';
import { UpdateZoidDto } from '../dto/zoid.dto';
import { validationBodyMiddleware } from '../middlewares/validation.middleware';

const router = new Router();
const zoidController = new ZoidController();

export default router
  .put(`/zoid`, validationBodyMiddleware(UpdateZoidDto), zoidController.put.bind(zoidController))
  .get(`/zoid`, zoidController.get.bind(zoidController));
