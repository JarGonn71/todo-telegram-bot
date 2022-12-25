import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { Context, Telegraf } from 'telegraf';
import { InjectBot, Start } from 'nestjs-telegraf';

@Controller()
export class AppController {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Hi! Friend ');
  }
}
