const { 
    regKeyboard, 
    menuKeyboard, 
    returnToMenuKeyboard, 
    queueKeyboard, 
    returnToQueueKeyboard, 
    kprogPriorityKeyBoard, 
    returnToKProg,
    adminKeyboard,
    setPriorityKeyboard
} = require('./keyboards'); // Импорт клавиатур

const { InputFile } = require('grammy');
const { students } = require('./students/students');
const { 
    insertIntoDatabase, 
    isRegistered, 
    getInfoById, 
    getAllUsers, 
    insertToKProg, 
    getKProgQueue, 
    setPriority,
    isInUsers, 
    setPriorityBySurname
} = require('./database/database');

const { showMenu } = require('./menu');
const { generatePriorityTable, generateQueueTable } = require('./tables/tables') 
const { lessons } = require ('./lessons/lessons')
const config = require('./config.json');



function commands(bot) {

    bot.command('start', async (ctx) => {
        // Проверка состояния регистрации
        if (ctx.session.step === 'waiting_for_name') {

            // Убедитесь, что в ctx.session есть необходимые поля
            ctx.session.photoMessageId = ctx.session.photoMessageId || undefined;
            ctx.session.KProgPhotoMessageId = ctx.session.KProgPhotoMessageId || undefined;

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
        let isUserRegistered = await isRegistered(ctx.msg.from.id);
            if (!isUserRegistered) {
                await ctx.reply('❗Вы ещё не зарегестрированы! Напишите /start для регистрации');
                return;
            }

        if (ctx.session.step === 'waiting_for_name') {
            await ctx.reply('❗Вы ещё не завершили регистрацию. Пожалуйста, введите фамилию и имя.');
            return;
        }

        showMenu(ctx);
    })

    bot.command('adminmenu', async (ctx) => {
        if (ctx.from.id === 755901230) {
            await ctx.reply("Меню", {
                reply_markup: adminKeyboard
            });
        } else {
            await ctx.reply("У вас нет прав на эту команду");
        }
    });

    bot.callbackQuery('setPr', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText('Введите фамилию студента, которому нужно поменять приоритет:', {
            parse_mode: 'MarkdownV2'
        });

        ctx.session.step = 'waiting_for_prioritySurname';
    })

    bot.callbackQuery(/set(.*)Priority/, async (ctx) => {
        const priority = ctx.match[1]; // Получаем цвет из callback данных

        const priorities = {
            "Red": "Красный",
            "Yellow": "Жёлтый",
            "Green": "Зелёный",
            "Purple": "Санкции"
        }
        const surname = ctx.session.surname; // Извлекаем сохраненную фамилию
        if (surname) {
            await setPriorityBySurname(surname, priorities[priority]); // Устанавливаем приоритет
            await ctx.editMessageText(`Приоритет пользователя ${surname} изменён на ${priorities[priority]}`, {
                reply_markup: kprogPriorityKeyBoard
            });
        } else {
            await ctx.reply('Не удалось найти фамилию. Попробуйте ещё раз.');
        }
        ctx.session.step = null; // Завершаем процесс
    });

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
        if (ctx.session.KProgPhotoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.KProgPhotoMessageId);
            ctx.session.KProgPhotoMessageId = undefined; // Сбрасываем ID
        }

        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`📒 *Очереди на предметы*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: queueKeyboard
        })
    });

    bot.callbackQuery('kprog', async (ctx) => {
        await ctx.answerCallbackQuery();

        if (ctx.session.photoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.photoMessageId);
            ctx.session.photoMessageId = undefined; // Сбрасываем ID
        }
        await ctx.deleteMessage();

        let status = "";
        const queue = await getKProgQueue();
        
        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status = "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status = "Вы ещё не записались в таблицу"
            }

            await generateQueueTable(queue);
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/KProgTable.png"));
            ctx.session.KProgPhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на КПрог\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: kprogPriorityKeyBoard
        })
    });

    bot.callbackQuery('priorityInfo', async (ctx) => {
        await ctx.answerCallbackQuery();
    
        // Удаляем предыдущее сообщение
        if (ctx.session.KProgPhotoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.KProgPhotoMessageId);
            ctx.session.KProgPhotoMessageId = undefined; // Сбрасываем ID
        }
        await ctx.deleteMessage();
    
        // Получаем данные и создаём таблицу
        let data = await getAllUsers();
        data.sort((a, b) => {
            if (a.surname < b.surname) return -1;
            if (a.surname > b.surname) return 1;
            return 0;
        });
        console.log(data);
        await generatePriorityTable(data);
    
        // Отправляем изображение
        let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/priorityTable.png"));
        ctx.session.photoMessageId = photoMessage.message_id;
    
        // Отправляем текст
        await ctx.reply(
            '💻 *Как работают приоритеты?*\n\nПриоритеты необходимы для того,' 
            +'чтобы студенты, которые не успели сдать лабораторную работу, имели возможность' 
            +'сделать это в первую очередь на следующей паре\\.\n\n'
            +'*Есть несколько видов приоритетов:*\n\n'
            +'🟥 __*Красный*__ \\- приоритет, который даётся в том случае, когда человек __*вообще не имел возможности подойти*__ и сдать \\(не успел по очереди\\)\n'
            +'🟨 __*Жёлтый*__ \\- приоритет, который даётся, если человек хотя бы раз за пару __*попробовал сдать*__ лабораторную работу, но __*не сдал*__\n'
            +'🟩 __*Зелёный*__ \\- даётся в том случае, когда студент __*сдал*__ лабораторную работу '
            +'_\\(если сдавалось 2 лабы, но была сдана только одна, то всё равно даётся зелёный приоритет\\)_\n'
            +'🟪 __*Фиолетовый*__ \\- __*санкции*__, которые накладываются в том случае, когда студент решил с кем\\-то поменяться очередью во время сдачи лаб\n\n'
            +'Таблица приоритетов представленна выше',
            {
                parse_mode: 'MarkdownV2',
                reply_markup: returnToKProg
            }
        );
    });
    

    bot.callbackQuery('isp', async (ctx) => {
        await ctx.answerCallbackQuery();

        let status = "_Пока никакой очереди нет_";
        await ctx.callbackQuery.message.editText(`*🖥 Очередь на ИСП\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });

    bot.callbackQuery('pzma', async (ctx) => {
        await ctx.answerCallbackQuery();

        let status = "_Пока никакой очереди нет_";
        await ctx.callbackQuery.message.editText(`📈 *Очередь на ПЗМА\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });

    bot.callbackQuery('mcha', async (ctx) => {
        await ctx.answerCallbackQuery();

        let status = "_Пока никакой очереди нет_";
        await ctx.callbackQuery.message.editText(`👴🏻 *Очередь на МЧА\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });

    bot.callbackQuery('bzch', async (ctx) => {
        await ctx.answerCallbackQuery();

        let status = "_Пока никакой очереди нет_";
        await ctx.callbackQuery.message.editText(`🌡 *Очередь на БЖЧ\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: returnToQueueKeyboard
        })
    });
     
    bot.callbackQuery(/signLesson:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();
        
        // Извлекаем тип занятия из callback_data
        const lessonType = ctx.match[1]; // "kprog", "isp", и т.д.
        
        // Отправляем сообщение с динамическим текстом
        await ctx.callbackQuery.message.editText(
            `*Запись на ${lessons.get(lessonType)}*\n\nВведите номер лаборатной \\(лабораторных\\), которую вы будете сдавать\\:`,
            {
                parse_mode: 'MarkdownV2',
            }
        );
    
        // Задаём шаг с учётом типа занятия
        ctx.session.step = `waiting_for_${lessonType}Lab`;
    });

    bot.callbackQuery('passed', async (ctx) => {
        await ctx.answerCallbackQuery();

        await setPriority(ctx.from.id.toString(), "Зелёный");
        await ctx.callbackQuery.message.editText(`*🎉 Поздравляю со сдачей\\!*\n\n_🟩 Вам выдан зелёный приоритет_`, {
            parse_mode: 'MarkdownV2',
            reply_markup: kprogPriorityKeyBoard
        })
    });

    bot.callbackQuery('notPassed', async (ctx) => {
        await ctx.answerCallbackQuery();

        await setPriority(ctx.from.id.toString(), "Жёлтый");
        await ctx.callbackQuery.message.editText(`*😔 Ничего страшного\\!*\nНа следующей паре вы сможете сдать чуть первее других\n\n🟨 _Вам выдан жёлтый приоритет_`, {
            parse_mode: 'MarkdownV2',
            reply_markup: kprogPriorityKeyBoard
        })
    });

    bot.callbackQuery('notPsbl', async (ctx) => {
        await ctx.answerCallbackQuery();

        await setPriority(ctx.from.id.toString(), "Красный");
        await ctx.callbackQuery.message.editText(`*☹️ Очень жаль, что вы не успели\\.*\nНа следующей паре вы сможете сдать лабораторную работу одним\\(\\-ой\\) из первых\n\n_🟥 Вам выдан красный приоритет_`, {
            parse_mode: 'MarkdownV2',
            reply_markup: kprogPriorityKeyBoard
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
            
            await insertIntoDatabase(fullName, ctx.msg.from.id.toString());

            await ctx.reply(`✅ Отлично, ${students.get(fullName).name}! Вы зарегистрированы!`);
            showMenu(ctx);
            
            // Очистка шага регистрации
            ctx.session.step = null; 
        } else if (ctx.session.step === "waiting_for_kprogLab") {
            let lab = ctx.message.text;

            const KProgQueue = await getKProgQueue();
            const userInfo = await getInfoById(ctx.from.id.toString());
            const queue = [
                [[],[],[]],
                [[],[],[]]
            ]

            let subgroupIndex, userSubgpoup;
            if (config.KProgLessonType == 0) {
                queue.pop();
                queue.flat(1);
                userSubgpoup = 0;
            } else {  
                userSubgpoup = userInfo.subgroup - 1;
            }


            priorityIndex = new Map();
            priorityIndex.set("Красный", 0);
            priorityIndex.set("Жёлтый", 1);
            priorityIndex.set("Зелёный", 2);
            priorityIndex.set("Санкции", 2);
           
            if (KProgQueue?.length) {
                KProgQueue.forEach(item => {
                    if (config.KProgLessonType == 0) {
                        subgroupIndex = 0;
                    } else {
                        subgroupIndex = item.subgroup - 1;
                    }
                    queue[subgroupIndex][priorityIndex.get(item.priority)].push(item); 
                });
            }
            
            queue[userSubgpoup][priorityIndex.get(userInfo.priority)].push({
                tg_id: userInfo.tg_id,
                surname: userInfo.surname,
                labs: lab,
                priority: userInfo.priority,
                subgroup: userInfo.subgroup
            });

            if (config.KProgLessonType == 2) {
                [queue[0], queue[1]] = [queue[1], queue[0]];
            }

            insertToKProg(queue.flat(2));

            await ctx.reply(`✅ Отлично! Вы записаны!`, {
                reply_markup: returnToKProg
            });
            
        } else if (ctx.session.step === "waiting_for_prioritySurname") {
            let surname = ctx.message.text;

            let isUserRegistered = await isInUsers(surname);
            if (isUserRegistered) {
                ctx.session.surname = surname;
                ctx.session.step = 'waiting_for_priority';
                await ctx.reply('Какой приоритет выставить?', {
                    reply_markup: setPriorityKeyboard
                })
            } else {
                await ctx.reply('❌ *Такого студента нет в группе\\!* Введите корректную фамилию:', {
                    parse_mode: 'MarkdownV2'
                });
                ctx.session.step = null;
            }

        } else {
            await ctx.reply('❓ Я не понимаю это сообщение. Для начала нажмите /start или перейдите в меню /menu');
        }
    });

}

module.exports = { commands };
