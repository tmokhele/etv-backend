import {Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseFilters, UsePipes} from '@nestjs/common';
import {UserService} from './user.service';
import {User} from './user.interface';
import {HttpException} from '@nestjs/common/exceptions/http.exception';
import {UserDecorator} from './user.decorator';


import {ApiBearerAuth, ApiBody, ApiParam, ApiProperty, ApiTags} from '@nestjs/swagger';
import {UpdateUserDto} from "./dto/update-user.dto";
import {CreateUserDto} from "./dto/create-user.dto";
import {LoginUserDto} from "./dto/login-user.dto";
import {ValidationPipe} from "../shared/pipes/validation.pipe";
import {HttpExceptionFilters} from "../shared/filters/http-exception.filter";

@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Get('user')
    @UseFilters(HttpExceptionFilters)
    @ApiParam({name: 'email', required: true, description: 'email', schema: { oneOf: [{type: 'string'}]}})
    async findMe( @UserDecorator('email') email: string): Promise<User> {
        return await this.userService.findByEmail(email);
    }

    @Get('ping')
    @UseFilters(HttpExceptionFilters)
    async ping(): Promise<string> {
        return 'Alive';
    }
    @ApiBody({ type: UpdateUserDto })
    @Put('user')
    @ApiParam({name: 'id', required: true, description: 'user id', schema: { oneOf: [{type: 'integer'}]}})
    @UseFilters(HttpExceptionFilters)
    async update(@UserDecorator('id') userId: number, @Body('user') userData: UpdateUserDto) {
        return await this.userService.update(userId, userData);
    }


    @UsePipes(new ValidationPipe())
    @UseFilters(HttpExceptionFilters)
    @ApiBody({ type: CreateUserDto })
    @Post('users')
    async create(@Body('user') userData: CreateUserDto) {
        return this.userService.create(userData);
    }

    @Delete('users/:slug')
    @UseFilters(HttpExceptionFilters)
    async delete(@Param() params) {
        return await this.userService.delete(params.slug);
    }

    @ApiBody({ type: LoginUserDto })
    @UsePipes(new ValidationPipe())
    @UseFilters(HttpExceptionFilters)
    @Post('users/login')
    async login(@Body('user') loginUserDto: LoginUserDto): Promise<User> {
        const _user = await this.userService.findOne(loginUserDto);

        const errors = {User: ' not found'};
        if (!_user) throw new HttpException({errors}, 401);

        const token = await this.userService.generateJWT(_user);
        const {email, username, bio, image} = _user;
        const user = {email, token, username, bio, image};
        return {user}
    }
}
