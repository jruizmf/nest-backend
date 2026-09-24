import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateSubCategoryDto {
  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsString()
  @MinLength(1)
  name: string;

  @IsString()
  @MinLength(1)
  description: string;

  @IsOptional()
  @IsUUID()
  category_id?: string;
}
