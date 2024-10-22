const { regKeyboard, menuKeyboard, returnToMenuKeyboard } = require('./keyboards'); // Импорт клавиатур

const { students } = require('./students');
const { insertIntoDatabase, isRegistered, getInfoById } = require('./database');
const { showMenu } = require('./menu');

function commands(bot) {
    bot.command('start', async (ctx) => {
        // Проверка состояния регистрации
        if (ctx.session.step === 'waiting_for_name') {
            await ctx.reply('❗Вы ещё не завершили регистрацию. Пожалуйста, введите фамилию и имя.');
            return;
        }

        await ctx.reply('👋 Привет! Это бот для записи на сдачу лабораторных работ.');
        
        try {
            let isUserRegistered = await isRegistered(ctx.msg.from.id);
            if (!isUserRegistered) {
            await ctx.reply('📋 Давай пройдём регистрацию:', {
                reply_markup: regKeyboard // Используем клавиатуру
            });
            } else {
                showMenu(ctx);
            }
        } catch (error) {
            console.error('❗Ошибка при проверке регистрации:', error);
        }
    });

    bot.command('menu', async (ctx) => {
        if (ctx.session.step === 'waiting_for_name') {
            await ctx.reply('❗Вы ещё не завершили регистрацию. Пожалуйста, введите фамилию и имя.');
            return;
        }

        showMenu(ctx);
    })

    bot.callbackQuery('reg', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText('Чтобы пройти регистрацию, введите вашу фамилию:\n\n_Например: Иванов_', {
            parse_mode: 'MarkdownV2'
        });
        ctx.session.step = 'waiting_for_name';
    });

    bot.callbackQuery('profile', async (ctx) => {
        await ctx.answerCallbackQuery();
        
        try {
            let userInfo = await getInfoById(ctx.from.id.toString());
            if (userInfo) {
                await ctx.callbackQuery.message.editText(`📊 *Ваш профиль:*\n\n*Фамилия:* ${userInfo.surname}\n*Имя:* ${userInfo.name}\n*№ подгруппы:* ${userInfo.subgroup}`, {
                    parse_mode: 'MarkdownV2',
                    reply_markup: returnToMenuKeyboard
                });
            } else {
                console.log("Пользователь с таким tg_id не найден.");
            }
        } catch (error) {
            console.error("Ошибка при получении информации:", error);
        }

        
    });

    bot.callbackQuery('returnToMenu', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`📖 *Меню:*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: menuKeyboard
        })
    })

    bot.on('message', async (ctx) => {
        if (ctx.session.step === 'waiting_for_name') {
            let fullName = ctx.message.text;
            
            let name = fullName.split(" ")[0];
            fullName = name[0].toUpperCase() + name.substr(1).toLowerCase();

            if (!students.has(fullName)) {
                await ctx.reply('❌ *Такого студента нет в группе\\!* Введите корректную фамилию:', {
                    parse_mode: 'MarkdownV2'
                });
                return;
            }
            
            insertIntoDatabase(fullName, ctx.msg.from.id.toString());

            await ctx.reply(`✅ Отлично, ${students.get(fullName).name}! Вы зарегистрированы!`)
            
            // Очистка шага регистрации
            ctx.session.step = null; 
        } else {
            await ctx.reply('❓ Я не понимаю это сообщение. Для начала нажмите /start или перейдите в меню /menu');
        }
    });
}

module.exports = { commands };
