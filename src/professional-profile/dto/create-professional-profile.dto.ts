import { IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateProfessionalProfileDto {
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
  professional_licence: string;

  @IsString()
  @MinLength(1)
  postal_code: string;

  @IsString()
  @MinLength(1)
  address: string;

  @IsString()
  @MinLength(1)
  neighborhood: string;

  @IsString()
  @MinLength(1)
  city: string;

  @IsString()
  @MinLength(1)
  state: string;

  @IsString()
  @MinLength(1)
  country: string;

  @IsString()
  @MinLength(1)
  image: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUUID()
  user_id?: string;
}
