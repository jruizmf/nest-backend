import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from '../entities/session.entity';

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
  ) {}

  create(userId: string, token: string) {
    console.log('Creating session for userId:', userId, 'with token:', token);
    const session = this.sessionsRepository.create({
      user_id: userId,
      token,
      active: true,
      date_added: new Date(),
    });
    return this.sessionsRepository.save(session);
  }

  async deactivate(sessionId: string) {
    const session = await this.sessionsRepository.findOneBy({ id: sessionId });
    if (!session) {
      return null;
    }
    session.active = false;
    session.date_modified = new Date();
    return this.sessionsRepository.save(session);
  }
}
