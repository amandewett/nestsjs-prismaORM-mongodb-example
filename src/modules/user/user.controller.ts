import { Body, Controller, HttpCode, Get, Post, UsePipes, ValidationPipe, UseGuards, Request, Param, ParseIntPipe, Query, DefaultValuePipe, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import { LoginUserDto } from './dto/loginUser.dto';
import { Roles } from "../../enums/enums";
import { Role } from "../../middleware/decorators/role.decorator";
import { AuthGuard } from "../../middleware/authGuard.service";

@ApiTags("user")
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }

    @Post("/register")
    @ApiOperation({ summary: "Register new user" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async registerUser(@Body() data: RegisterUserDto): Promise<any> {
        return await this.userService.registerUser(data);
    }

    @Post("/login")
    @ApiOperation({ summary: "Login user" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async loginUser(@Body() data: LoginUserDto): Promise<any> {
        return await this.userService.loginUser(data);
    }

    @Role(Roles.Admin, Roles.User)
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @Get('/details')
    @ApiOperation({ summary: "get user details" })
    @HttpCode(200)
    @UsePipes(ValidationPipe)
    async getUserDetails(@Request() req): Promise<any> {
        const userId = req.user.id;
        return await this.userService.getUserDetails(userId);
    }
}
