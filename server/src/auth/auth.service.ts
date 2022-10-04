import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from './../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findByName(username);

    const result = await bcrypt.compare(pass, user.password);
    if (!result) return null;

    const { password, ...res } = user;
    return res;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      ...user,
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '60s',
      }),
      refresh_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '1h',
      }),
    };
  }

  async refresh(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_ACCESS_SECRET,
        expiresIn: '60s',
      }),
    };
  }
}
