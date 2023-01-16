const { env } = process;

export const app = {
  port: Number(env.PORT) || 3000,
};

export const zoid = {
  defaultPrice: Number(env.ZOID_DEFAULT_PRICE) || 100,
};

export default {
  app,
};
