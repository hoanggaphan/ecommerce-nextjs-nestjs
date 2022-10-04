import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './../user/user.module';
import { AccessTokenStrategy } from './access-token.strategy';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
