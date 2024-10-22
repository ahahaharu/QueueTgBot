const { regKeyboard, yesOrNoKeyboard } = require('./keyboards'); // Импорт клавиатур

const { students } = require('./students');
const { insertIntoDatabase, isRegistered } = require('./database');

function commands(bot) {
    bot.command('start', async (ctx) => {
        console.log(ctx.msg);
        // Проверка состояния регистрации
        if (ctx.session.step === 'waiting_for_name') {
            await ctx.reply('Вы ещё не завершили регистрацию. Пожалуйста, введите фамилию и имя.');
            return;
        }

        await ctx.reply('Привет! Это бот для записи на сдачу лабораторных работ.');
        
        try {
            let isUserRegistered = await isRegistered(ctx.msg.from.id);
            if (!isUserRegistered) {
            await ctx.reply('Давай пройдём регистрацию:', {
                reply_markup: regKeyboard // Используем клавиатуру
            });
            }
        } catch (error) {
            console.error('Ошибка при проверке регистрации:', error);
        }
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
            
            let name = fullName.split(" ")[0];
            fullName = name[0].toUpperCase() + name.substr(1).toLowerCase();

            if (!students.has(fullName)) {
                await ctx.reply('*Такого студента нет в группе\\!* Введите корректную фамилию:', {
                    parse_mode: 'MarkdownV2'
                });
                return;
            }
        
            insertIntoDatabase(fullName, ctx.msg.from.id.toString());

            await ctx.reply(`Отлично, ${students.get(fullName).name}! Вы зарегистрированы!`)
            
            // Очистка шага регистрации
            ctx.session.step = null; 
        } else {
            await ctx.reply('Я не понимаю это сообщение. Для начала нажмите /start.');
        }
    });
}

module.exports = { commands };
