require('dotenv').config();

const { Bot, GrammyError, HttpError, InlineKeyboard} = require('grammy');
const { hydrate } = require('@grammyjs/hydrate');
const { session, MemorySessionStorage } = require('grammy');

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.use(session({
    initial: () => ({ step: null }),
    storage: new MemorySessionStorage()
}));

// TODO: добавить меню

const regKeyboard = new InlineKeyboard().text('Пройти регистрацию', 'reg');
const yesOrNoKeyboard = new InlineKeyboard()
    .text('Да', 'reg_yes')
    .text('Нет', 'reg_no')

// TODO: обработать кнопки

bot.command('start', async (ctx) => {
    console.log(ctx.msg);
    // Проверка состояния регистрации
    if (ctx.session.step === 'waiting_for_name') {
        await ctx.reply('Вы ещё не завершили регистрацию. Пожалуйста, введите фамилию и имя.');
        return;
    }

    await ctx.reply('Привет! Это бот для записи на сдачу лабораторных работ.');
    await ctx.reply('Давай пройдём регистрацию:', {
        reply_markup: regKeyboard
    });
});


bot.callbackQuery('reg', async (ctx) => {
    await ctx.answerCallbackQuery();
    await ctx.callbackQuery.message.editText('Чтобы пройти регистрацию, введите вашу фамилию и имя:\n\n_Например: Иванов Иван_', {
        parse_mode: 'MarkdownV2'
    });
    ctx.session.step = 'waiting_for_name';
});

bot.on('message', async (ctx) => {
    if (ctx.session.step === 'waiting_for_name') {
        const fullName = ctx.message.text;
        
        // Простая валидация ввода (можно расширить при необходимости)
        if (!fullName.includes(' ')) {
            await ctx.reply('Пожалуйста, введите корректные фамилию и имя в формате:\n\n_Иванов Иван_', {
                parse_mode: 'MarkdownV2'
            });
            return;
        }

        // Сохраняем фамилию и имя (тут можно сохранить в базу данных или продолжить с другой логикой)
        await ctx.reply(`Спасибо\\! Вы зарегистрированы как: _${fullName}_\n\nВсё верно?`, {
            parse_mode: 'MarkdownV2',
            reply_markup: yesOrNoKeyboard
        } );
        
        // Очистка шага регистрации
        ctx.session.step = null; // TODO: после нажатия на "да", должна использоваться эта функция, а при нажатии на "нет" - не должна
    } else {
        await ctx.reply('Я не понимаю это сообщение. Для начала нажмите /start.');
    }
});

bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
});

bot.start();
