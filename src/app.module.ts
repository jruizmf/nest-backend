import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserRole } from './entities/user-role.entity';
import { Session } from './entities/session.entity';
import { Configuration } from './entities/configuration.entity';
import { ProfessionalProfile } from './entities/professional-profile.entity';
import { UserProfile } from './entities/user-profile.entity';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ProfessionalProfileModule } from './professional-profile/professional-profile.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [
          User,
          Role,
          UserRole,
          Session,
          Configuration,
          ProfessionalProfile,
          UserProfile,
        ],
        // Schema already exists (created by the original Sequelize migrations) - never
        // auto-alter it. Set DB_SYNCHRONIZE=true only against a disposable/test database.
        synchronize: config.get<string>('DB_SYNCHRONIZE') === 'true',
      }),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/',
    }),
    AuthModule,
    UsersModule,
    RolesModule,
    ConfigurationModule,
    ProfessionalProfileModule,
    UserProfileModule,
    UploadModule,
  ],
})
export class AppModule {}
