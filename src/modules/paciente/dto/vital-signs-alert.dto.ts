import { ApiProperty } from "@nestjs/swagger";
import { IsDecimal, IsNotEmpty, IsNumber } from "class-validator";


export class VitalSignsAlertDto {
    
    @ApiProperty()
    bpm : string;
    
    @ApiProperty()
    temperature: string; 

    @ApiProperty()
    type : number;
} 