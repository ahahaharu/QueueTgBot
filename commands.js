const { regKeyboard, menuKeyboard, returnToMenuKeyboard, queueKeyboard, returnToQueueKeyboard, kprogPriorityKeyBoard, returnToKProg } = require('./keyboards'); // Импорт клавиатур

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

    bot.callbackQuery('queue', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`📒 *Очереди на предметы*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: queueKeyboard
        })
    });

    bot.callbackQuery('kprog', async (ctx) => {
        await ctx.answerCallbackQuery();
        let status = "_Пока никакой очереди нет_"
        await ctx.callbackQuery.message.editText(`💻 *Очередь на КПрог\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: kprogPriorityKeyBoard
        })
    });

    bot.callbackQuery('priorityInfo', async (ctx) => {
        await ctx.answerCallbackQuery();

        // generatePriotiryTable();

        await ctx.callbackQuery.message.editText('💻 *Как работают приоритеты?*\n\nПриоритеты необходимы для того,' 
            +'чтобы студенты, которые не успели сдать лабораторную работу, имели возможность' 
            +'сделать это в первую очередь на следующей паре\\.\n\n'
            +'*Есть несколько видов приоритетов:*\n\n'
            +'🟥 __*Красный*__ \\- приоритет, который даётся в том случае, когда человек __*вообще не имел возможности подойти*__ и сдать \\(не успел по очереди\\)\n'
            +'🟨 __*Жёлтый*__ \\- приоритет, который даётся, если человек хотя бы раз за пару __*попробовал сдать*__ лабораторную работу, но __*не сдал*__\n'
            +'🟩 __*Зелёный*__ \\- даётся в том случае, когда студент __*сдал*__ лабораторную работу '
            +'_\\(если сдавалось 2 лабы, но была сдана только одна, то всё равно даётся зелёный приоритет\\)_\n'
            +'🟪 __*Фиолетовый*__ \\- __*санкции*__, которые накладываются в том случае, когда студент решил с кем\\-то поменяться очередью во время сдачи лаб\n\n'
            +'Таблица приоритетов представленна в таблице', {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToKProg
        })
    });

    bot.callbackQuery('isp', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`*В разработке*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });

    bot.callbackQuery('pzma', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`*В разработке*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });

    bot.callbackQuery('mcha', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`*В разработке*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });

    bot.callbackQuery('bzch', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`*В разработке*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });
     

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
