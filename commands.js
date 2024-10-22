const { regKeyboard, yesOrNoKeyboard } = require('./keyboards'); // Импорт клавиатур

const { students } = require('./students');

function commands(bot) {
    bot.command('start', async (ctx) => {
        console.log(ctx.msg);
        // Проверка состояния регистрации
        if (ctx.session.step === 'waiting_for_name') {
            await ctx.reply('Вы ещё не завершили регистрацию. Пожалуйста, введите фамилию и имя.');
            return;
        }

        await ctx.reply('Привет! Это бот для записи на сдачу лабораторных работ.');
        await ctx.reply('Давай пройдём регистрацию:', {
            reply_markup: regKeyboard // Используем клавиатуру
        });
    });

    bot.callbackQuery('reg', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText('Чтобы пройти регистрацию, введите вашу фамилию:\n\n_Например: Иванов_', {
            parse_mode: 'MarkdownV2'
        });
        ctx.session.step = 'waiting_for_name';
    });

    bot.on('message', async (ctx) => {
        if (ctx.session.step === 'waiting_for_name') {
            let fullName = ctx.message.text;
            
            fullName = fullName[0].toUpperCase() + fullName.substr(1).toLowerCase();

            if (!students.has(fullName)) {
                await ctx.reply('*Такого студента нет в группе\\!* Введите корректную фамилию:', {
                    parse_mode: 'MarkdownV2'
                });
                return;
            }
        
            await ctx.reply(`Отлично, ${students.get(fullName).name}! Вы зарегистрированы!`)
            
            // Очистка шага регистрации
            ctx.session.step = null; 
        } else {
            await ctx.reply('Я не понимаю это сообщение. Для начала нажмите /start.');
        }
    });
}

module.exports = { commands };
