import { IsNotEmpty, Length, Validate } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto {
    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty({ nullable: true })
    firstName: string;

    @ApiProperty({ nullable: true })
    lastName: string;
}
