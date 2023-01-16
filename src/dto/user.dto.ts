import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsPositive, IsString } from 'class-validator';
import { UserUsdBalanceAction, UserZoidBalanceAction } from '../interfaces';
import { Transform } from 'class-transformer';

const Trim = () => Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @Trim()
  public name: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  public username: string;

  @IsEmail()
  @IsNotEmpty()
  @Trim()
  public email: string;
}

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Trim()
  public name: string;

  @IsEmail()
  @IsOptional()
  @Trim()
  public email: string;
}

export class UpdateUserUsdBalanceDto {
  @IsIn(Object.values(UserUsdBalanceAction))
  @IsString()
  @IsNotEmpty()
  public action: UserUsdBalanceAction;

  @IsPositive()
  @IsNotEmpty()
  public amount: number;
}

export class UpdateUserZoidBalanceDto {
  @IsIn(Object.values(UserZoidBalanceAction))
  @IsString()
  @IsNotEmpty()
  public action: UserZoidBalanceAction;

  @IsPositive()
  @IsNotEmpty()
  public amount: number;
}
