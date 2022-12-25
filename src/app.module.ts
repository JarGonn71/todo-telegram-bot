import { Module } from '@nestjs/common';
import { AppUpdate } from './app.update';
import { AppService } from './app.service';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';

const session = new LocalSession({ database: 'session_db.json' });

@Module({
  imports: [
    TelegrafModule.forRoot({
      middlewares: [session.middleware()],
      token: '5964173306:AAEstmI8x3Uoj-w5SNdyyndx7BI01kHvDqM',
    }),
  ],
  providers: [AppService, AppUpdate],
})
export class AppModule {}
