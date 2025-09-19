import { IsEnum, IsNumber, IsString, Min } from 'class-validator';

export class CreateTripDto {
  @IsString() origin!: string;
  @IsString() destination!: string;
  @IsNumber() @Min(1) distanceKm!: number;
  @IsEnum(['FLIGHT','TRAIN','CAR'] as const) mode!: 'FLIGHT' | 'TRAIN' | 'CAR';
}
