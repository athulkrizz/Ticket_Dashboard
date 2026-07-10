import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { USERS } from '../users/users.data';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async validateUser(username: string, password: string) {
    const user = USERS.find(
      (u) => u.username === username && u.password === password,
    );
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return {
      username: user.username,
      displayName: user.displayName,
      role: user.role,
      avatar: user.avatar,
    };
  }

  async login(username: string, password: string) {
    const user = await this.validateUser(username, password);
    const payload = { sub: user.username, username: user.username, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  getUsers() {
    return USERS.map((u) => ({
      username: u.username,
      displayName: u.displayName,
      role: u.role,
      avatar: u.avatar,
    }));
  }
}
