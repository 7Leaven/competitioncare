import { IsString, IsNumber, IsEnum, IsOptional, Min } from 'class-validator';
import { CourseStatus } from '@prisma/client';

export class CreateCourseDto {
  @IsString()
  title: string;

  @IsString()
  slug: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsEnum(CourseStatus)
  @IsOptional()
  status?: CourseStatus;
}
