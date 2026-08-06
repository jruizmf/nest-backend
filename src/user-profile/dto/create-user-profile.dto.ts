import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateUserProfileDto {
  @IsString()
  @MinLength(1)
  ocupation: string;

  @IsString()
  @MinLength(1)
  university: string;

  @IsString()
  @MinLength(1)
  telephone: string;

  @IsString()
  @MinLength(1)
  RFC: string;

  @IsString()
  @MinLength(1)
  city: string;

  @IsString()
  @MinLength(1)
  state: string;

  @IsString()
  @MinLength(1)
  country: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;
}
