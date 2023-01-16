import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Context, Next } from 'koa';
import { BadRequestException } from '../exceptions';

export const validationBodyMiddleware = (instanceClass: any, skipMissingProperties = false) => {
  return async (ctx: Context, next: Next) => {
    const errors = await validate(plainToInstance(instanceClass, ctx.request.body || {}), {
      skipMissingProperties,
    });
    if (errors.length > 0) {
      const message = errors
        .map((error: ValidationError) => Object.values(error.constraints))
        .flat()
        .join(', ');

      ctx.throw(new BadRequestException(message));
    }

    await next();
  };
};
