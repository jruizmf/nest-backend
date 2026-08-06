import { IsString, MinLength } from 'class-validator';

export class CreateConfigurationDto {
  @IsString()
  @MinLength(1)
  identifier: string;

  @IsString()
  @MinLength(1)
  code: string;

  @IsString()
  @MinLength(1)
  value: string;
}
