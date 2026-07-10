import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurableAuthGuard implements CanActivate {
  private authEnabled: boolean;

  constructor(private configService: ConfigService) {
    this.authEnabled = this.configService.get<string>('AUTH_ENABLED') === 'true';
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    if (!this.authEnabled) {
      // When auth is disabled, set a default user on the request
      const request = context.switchToHttp().getRequest();
      request.user = { username: 'admin', role: 'admin' };
      return true;
    }

    const guard = new (AuthGuard('jwt'))();
    return guard.canActivate(context) as boolean | Promise<boolean>;
  }
}
