import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../schemas/user.entity';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController 
{
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    registerUser(@Body() user: User, @Res() resp: Response) {
        return this.authService.registerUser(user, resp);
    }

    @Post('/login')
    loginUser(@Body() user: User, @Res() resp: Response) {
        return this.authService.loginUser(user, resp);
    }

    @Post('/getUser')
    authUser(@Req() req: Request, @Res() resp: Response) {
        return this.authService.getUser(req, resp);
    }
}
