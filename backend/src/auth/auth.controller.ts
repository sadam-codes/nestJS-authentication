import {
  Controller,
  Get,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Param, Patch, Req, UseGuards } from '@nestjs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/models/user.model';

@Injectable()
class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context);
  }
}
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/getall')
  getAll() {
    return this.authService.getAll();
  }

  @Post('/register')
  register(@Body() body: { name: string; email: string; password: string }) {
    return this.authService.register(body.name, body.email, body.password);
  }

  @Post('/login')
  login(@Body() body: { email: string; password: string }) {
    return this.authService.login(body.email, body.password);
  }
  @Patch('/admin-update/:userId')
  @UseGuards(JwtAuthGuard)
  async adminUpdate(
    @Req() req,
    @Param('userId') userId: number,
    @Body()
    body: { name?: string; email?: string; password?: string },
  ) {
    if (req.user.role !== 'admin') {
      throw new UnauthorizedException('Only admins can perform this action');
    }
    const adminId = req.user.id;
    return this.authService.updateRecord(
      adminId,
      userId,
      body.name,
      body.email,
      body.password,
    );
  }
  @Post('/forgot-password')
  sendOtp(@Body('email') email: string) {
    return this.authService.sendOtp(email);
  }

  @Post('/reset-password')
  resetPassword(
    @Body('email') email: string,
    @Body('otp') otp: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(email, otp, newPassword);
  }
}
