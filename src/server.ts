import Koa, { Context } from 'koa';
import koaBody from 'koa-body';
import gracefulShutdown from 'http-graceful-shutdown';
import morgan from 'koa-morgan';

import { app as appConfig } from './config';
import { errorMiddleware } from './middlewares';
import { UsersRouter, ZoidRouter } from './routes';
import { logger, stream } from './util/logger';

const { port } = appConfig;
const app = new Koa();

app.use(morgan('combined', { stream }));
app.use(errorMiddleware());
app.use(koaBody());
app.use(UsersRouter.routes()).use(UsersRouter.allowedMethods());
app.use(ZoidRouter.routes()).use(ZoidRouter.allowedMethods());

app.on('error', (e, ctx: Context) => {
  ctx.status = e.statusCode;
  ctx.body = e.message;
});

const server = app.listen(port, () => {
  logger.info(`Server started on ${port}`);
});
gracefulShutdown(server, {
  signals: 'SIGINT SIGTERM',
  timeout: 10000,
  development: false,
  forceExit: true,
  finally: () => {
    logger.info(`Server stopped`);
  },
});
