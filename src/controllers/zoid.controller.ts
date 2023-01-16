import { Context } from 'koa';
import { UpdateZoidDto } from '../dto/zoid.dto';
import zoidServiceInstance, { ZoidService } from '../services/zoid.service';

export class ZoidController {
  constructor(private readonly zoidService: ZoidService = zoidServiceInstance) {}

  async get(ctx: Context) {
    ctx.body = await this.zoidService.getZoid();
  }

  async put(ctx: Context) {
    const dto = ctx.request.body as UpdateZoidDto;
    ctx.body = await this.zoidService.setZoid(dto);
  }
}
