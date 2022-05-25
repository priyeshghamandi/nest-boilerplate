import {
    Body,
    Controller,
    Delete, Get, Patch, Post,
    Param,
    Query,
    Session,
    UseGuards
} from '@nestjs/common';
import { CreateUserDto } from "./dtos/create-user.dto";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dtos/update-user.dto";
import {Serialize} from "../interceptors/serialize.interceptor";
import { UserDto } from "./dtos/user.dto";
import {AuthService} from "./auth.service";
import {CurrentUser} from "./decorators/current-user.decorator";
import {User} from "./user.entity";
import {AuthGuard} from "../guards/auth.guard";

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
    constructor(private usersService: UsersService, private authService:AuthService){}

    @UseGuards(AuthGuard)
    @Get('/whoami')
    whoAmI(@CurrentUser() user: User) {
        return user;
    }

    @Post('/signup')
    async createUser(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signUp(body.email, body.password);
        session.userID = user.id;
        return user;
    }

    @Post('/signin')
    async signIn(@Body() body: CreateUserDto, @Session() session: any) {
        const user = await this.authService.signIn(body.email, body.password);
        session.userID = user.id;
        return user;
    }

    @Post('/signout')
    signOut(@Session() session: any) {
        session.userID = null;
    }


    @Get()
    findAllUsers(@Query('email') email: string) {
      return this.usersService.find(email);
    }

    @Get('/:id')
    findUser(@Param('id') id: string) {
        return this.usersService.findOne(Number(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
        return this.usersService.update(Number(id), body)
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.usersService.remove(Number(id));
    }
}
