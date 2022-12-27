import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import * as LocalSession from 'telegraf-session-local';
import { TaskEntity } from './taks.entity';

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: process.env.TELEGRAM_TOKEN_BOT,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      database: process.env.DATABASE_DB,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TaskEntity]),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
