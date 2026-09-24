import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { dataSourceOptions } from './database/data-source';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { ProfessionalProfileModule } from './professional-profile/professional-profile.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { UploadModule } from './upload/upload.module';
import { WeatherModule } from './weather/weather.module';
import { CategoryModule } from './category/category.module';
import { MenuModule } from './menu/menu.module';
import { SubCategoryModule } from './subcategory/subcategory.module';
import { PlacesModule } from './places/places.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    // Connection + entity list live in database/data-source.ts so the TypeORM CLI
    // (migrations) and the app agree. Schema changes go through migrations now.
    TypeOrmModule.forRoot(dataSourceOptions),
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
    WeatherModule,
    CategoryModule,
    MenuModule,
    SubCategoryModule,
    PlacesModule,
  ],
})
export class AppModule {}
