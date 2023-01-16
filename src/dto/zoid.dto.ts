import { IsPositive, IsNotEmpty } from 'class-validator';

export class UpdateZoidDto {
  @IsPositive()
  @IsNotEmpty()
  public price: number;
}
