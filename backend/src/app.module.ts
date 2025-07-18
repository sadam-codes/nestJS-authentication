import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Module({
  imports: [
    AuthModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sadam@123',
      database: 'test',
      autoLoadModels: true,
      synchronize: true,
      models: [User],
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
