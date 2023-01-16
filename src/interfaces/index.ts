export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  zoidAmount: number;
  usdBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserBalance {
  balance: number;
}

export interface Zoid {
  price: number;
  updatedAt: string;
}

export enum UserUsdBalanceAction {
  WITHDRAW = 'withdraw',
  DEPOSIT = 'deposit',
}

export enum UserZoidBalanceAction {
  BUY = 'buy',
  SELL = 'sell',
}
