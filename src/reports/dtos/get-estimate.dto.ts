import {IsLatitude, IsLongitude, IsNumber, IsString, Max, Min} from "class-validator";
import { Transform } from "class-transformer";

export class GetEstimateDto {
    @IsString()
    make: string;

    @IsString()
    model: string;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(1930)
    @Max(2021)
    year: number;


    @Transform(({ value }) => parseFloat(value))
    @IsLongitude()
    lng: number;


    @Transform(({ value }) => parseFloat(value))
    @IsLatitude()
    lat: number;

    @Transform(({ value }) => Number(value))
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

}