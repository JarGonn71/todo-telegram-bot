import { AppService } from './app.service';
import { Telegraf } from 'telegraf';
import { Ctx, Hears, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { actionButton } from './app.buttons';
import { Context } from './context.interface';
import { showList } from './app.utils';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('✋ Hi! Friend ');
    await ctx.reply('Что ты хочешь сделать', actionButton());
  }

  @Hears('🗂 Список дел')
  async listTask(ctx: Context) {
    const todos = await this.appService.getAll();
    await ctx.reply(showList(todos));
  }

  @Hears('🏆 Создать задачу')
  async createTask(ctx: Context) {
    await ctx.reply('Опиши задачу');
    ctx.session.type = 'create';
  }

  @Hears('✅ Завершить')
  async doneTask(ctx: Context) {
    await ctx.reply(' Напиши ID задачи: ');
    ctx.session.type = 'done';
  }

  @Hears('✏️ Редактирование')
  async editTask(ctx: Context) {
    await ctx.reply(' Напиши ID и новое название задачи: ');
    ctx.session.type = 'edit';
  }

  @Hears('🗑 Удаление')
  async deleteTask(ctx: Context) {
    await ctx.reply(' Напиши ID задачи: ');
    ctx.session.type = 'remove';
  }

  @On('text')
  async getMessage(@Message('text') message: string, @Ctx() ctx: Context) {
    if (!ctx.session.type) return;
    if (ctx.session.type === 'done') {
      const todos = await this.appService.doneTask(Number(message));
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Задачи с таким ID не найдено');
        return;
      }
      await ctx.reply(showList(todos));
    }
    if (ctx.session.type === 'edit') {
      const [taskId, taskName] = message.split('|');
      console.log(message.split(' | '));
      const todos = await this.appService.editTask(Number(taskId), taskName);
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Задачи с таким ID не найдено');
        return;
      }
      await ctx.reply(showList(todos));
    }
    if (ctx.session.type === 'remove') {
      const todos = await this.appService.deleteTask(Number(message));
      if (!todos) {
        await ctx.deleteMessage();
        await ctx.reply('Задачи с таким ID не найдено');
        return;
      }

      await ctx.reply(showList(todos));
    }
    if (ctx.session.type === 'create') {
      const todos = await this.appService.createTask(message);
      await ctx.reply(showList(todos));
    }
  }
}
