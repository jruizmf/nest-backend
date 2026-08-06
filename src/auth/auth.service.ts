import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { User } from '../entities/user.entity';
import { SessionsService } from '../sessions/sessions.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly sessionsService: SessionsService,
  ) {}

  async login(dto: LoginDto) {
    // Fixed from the original Express version, which looked users up by
    // `username` while the frontend actually sends `email` - nothing could log in.
    const user = await this.usersRepository.findOne({
      where: { email: dto.email },
      relations: {
        userRoles: { role: true },
        professionalProfile: true,
        userProfile: true,
      },
    });

    if (!user) {
      return { mensaje: 'Usuario no registrado.' };
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatches) {
      return { mensaje: 'Contraseña Incorrecta' };
    }

    // The password hash has no business being embedded in a token that sits in
    // the browser - the original Express version put the whole user row in there.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- destructured only to omit it below
    const { password, userRoles, ...safeUser } = user;
    const payload = {
      check: true,
      user: {
        ...safeUser,
        roles: userRoles?.map((userRole) => userRole.role) ?? [],
      },
    };

    const token = this.jwtService.sign(payload);
    console.log(user);
    await this.sessionsService.create(user.id, token);

    return {
      mensaje: 'Inicio de session exitoso.',
      date: Date.now(),
      token,
    };
  }

  async logout(sessionId: string) {
    const session = await this.sessionsService.deactivate(sessionId);
    if (!session) {
      return { message: 'Cannot logout' };
    }
    return { message: 'Logout succesful' };
  }
}
