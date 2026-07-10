import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigurableAuthGuard } from './configurable-auth.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    return this.authService.login(body.username, body.password);
  }

  @Get('users')
  @UseGuards(ConfigurableAuthGuard)
  getUsers() {
    return this.authService.getUsers();
  }
}
