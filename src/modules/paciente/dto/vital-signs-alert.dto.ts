import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsNumber } from "class-validator";


export class VitalSignsAlertDto {
    
    @ApiProperty()
    @IsDecimal()
    spO2 : number;

    @ApiProperty()
    @IsNumber()
    bpm : number;
    
    @ApiProperty()
    @IsDecimal()
    temperature: number; 
} 