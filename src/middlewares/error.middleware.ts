import { Context, Next } from 'koa';
import { logger } from '../util/logger';

export const errorMiddleware = () => {
  return async (ctx: Context, next: Next) => {
    try {
      await next();
    } catch (err) {
      const { message } = err;
      const errorStatus = err.statusCode || err.status;
      const statusCode = errorStatus || 500;

      if (errorStatus) {
        if (statusCode !== 404) {
          logger.info(message);
        }
      } else {
        logger.error(message);
      }

      let body = { message };
      if (statusCode === 500) {
        body = { message: 'Internal error' };
      }

      ctx.body = body;
      ctx.status = statusCode;
    }
  };
};
