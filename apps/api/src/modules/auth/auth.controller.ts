import {
  Controller,
  Post,
  Body,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type {
  LoginPayload,
  ForgotPasswordPayload,
  VerifyOtpPayload,
  ResetPasswordPayload,
} from '@hive/types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() payload: LoginPayload, @Req() req: any) {
    const ip = req.ip || req.connection?.remoteAddress || '127.0.0.1';
    const userAgent = req.headers['user-agent'] || 'Hive-Web-Client';
    return this.authService.login(payload, ip, userAgent);
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() payload: ForgotPasswordPayload) {
    return this.authService.forgotPassword(payload);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  async verifyOtp(@Body() payload: VerifyOtpPayload) {
    return this.authService.verifyOtp(payload);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() payload: ResetPasswordPayload) {
    return this.authService.resetPassword(payload);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: any) {
    const userId = req.user?.id || 'usr_owner';
    return this.authService.logout(userId);
  }
}
