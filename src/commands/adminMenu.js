const { InputFile } = require('grammy');

const {
    adminKeyboard, getReturnKeyboard,
    selectQueueKeyboard,
    doWithTable
} = require('../bot/keyboards'); 

const { generateQueueTable, generateBZCHTable } = require('../tables/tables');

const { setPriorityBySurname, getQueue, clearTable, insertIntoQueue } = require('../database/database');
const { readConfig } = require('../utils/config');


function adminMenuCommand(bot) {
    bot.command('adminmenu', async (ctx) => {
        if (ctx.from.id === 755901230) {
            await ctx.reply("Меню", {
                reply_markup: adminKeyboard
            });
        } else {
            await ctx.reply("У вас нет прав на эту команду 🤓☝️");
        }
    });

    bot.callbackQuery('setPr', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText('Введите фамилию студента, которому нужно поменять приоритет:', {
            parse_mode: 'MarkdownV2'
        });

        ctx.session.step = 'waiting_for_prioritySurname';
    })

    bot.callbackQuery('sendMsg', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText('Введите сообщение', {
            parse_mode: 'MarkdownV2'
        });

        ctx.session.step = 'waiting_for_adminMessage';
    })

    bot.callbackQuery('queueToChange', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText('Выберите таблицу, которую нужно изменить', {
            parse_mode: 'MarkdownV2',
            reply_markup: selectQueueKeyboard
        });  
    })

    bot.callbackQuery('changeKprog', async (ctx) => {
        await ctx.answerCallbackQuery();

        try {
            await ctx.deleteMessage();
        } catch (error) {
            if (error.message.includes("message can't be deleted for everyone")) {
                console.log("Сообщение уже удалено или не может быть удалено.");
            } else {
                console.error("Произошла другая ошибка:", error);
            }
        }

        let status = "";
        const queue = await getQueue('KProg');

        if (queue?.length) {
            await generateQueueTable(queue, 'KProgTable', 'КПрог');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/KProgTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на КПрог\n\n*`+status+"\n\nВыеберете, что сделать с таблицой:", {
            parse_mode: 'MarkdownV2',
            reply_markup: doWithTable('KProg')
        })
    });

    bot.callbackQuery('changeIsp', async (ctx) => {
        await ctx.answerCallbackQuery();

        try {
            await ctx.deleteMessage();
        } catch (error) {
            if (error.message.includes("message can't be deleted for everyone")) {
                console.log("Сообщение уже удалено или не может быть удалено.");
            } else {
                console.error("Произошла другая ошибка:", error);
            }
        }

        let status = "";
        const queue = await getQueue('ISP');

        if (queue?.length) {
            await generateQueueTable(queue, 'ISPTable', 'ИСП');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/ISPTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на ИСП\n\n*`+status+"\n\nВыеберете, что сделать с таблицой:", {
            parse_mode: 'MarkdownV2',
            reply_markup: doWithTable('ISP')
        })
    });

    bot.callbackQuery('changePzma', async (ctx) => {
        await ctx.answerCallbackQuery();

        try {
            await ctx.deleteMessage();
        } catch (error) {
            if (error.message.includes("message can't be deleted for everyone")) {
                console.log("Сообщение уже удалено или не может быть удалено.");
            } else {
                console.error("Произошла другая ошибка:", error);
            }
        }

        let status = "";
        const queue = await getQueue('PZMA');

        if (queue?.length) {
            await generateQueueTable(queue, 'PZMATable', 'ПЗМА');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/PZMATable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на ПЗМА\n\n*`+status+"\n\nВыеберете, что сделать с таблицой:", {
            parse_mode: 'MarkdownV2',
            reply_markup: doWithTable('PZMA')
        })
    });

    bot.callbackQuery('changeMcha', async (ctx) => {
        await ctx.answerCallbackQuery();

        try {
            await ctx.deleteMessage();
        } catch (error) {
            if (error.message.includes("message can't be deleted for everyone")) {
                console.log("Сообщение уже удалено или не может быть удалено.");
            } else {
                console.error("Произошла другая ошибка:", error);
            }
        }

        let status = "";
        const queue = await getQueue('MCHA');

        if (queue?.length) {
            await generateQueueTable(queue, 'MCHATable', 'МЧА');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/MCHATable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на МЧА\n\n*`+status+"\n\nВыеберете, что сделать с таблицой:", {
            parse_mode: 'MarkdownV2',
            reply_markup: doWithTable('MCHA')
        })
    });

    bot.callbackQuery('changeBzch', async (ctx) => {
        await ctx.answerCallbackQuery();

        try {
            await ctx.deleteMessage();
        } catch (error) {
            if (error.message.includes("message can't be deleted for everyone")) {
                console.log("Сообщение уже удалено или не может быть удалено.");
            } else {
                console.error("Произошла другая ошибка:", error);
            }
        }

        let status = "";
        const queue = await getQueue('BZCH');

        if (queue?.length) {
            await generateBZCHTable(queue);
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/BZCHTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status += "_В таблице ещё никого нет_"
        }
        
        await ctx.reply(`🌡 *Очередь на БЖЧ\n\n*`+status+"\n\nВыеберете, что сделать с таблицой:", {
            parse_mode: 'MarkdownV2',
            reply_markup: doWithTable('BZCH')
        })
    });

    bot.callbackQuery(/clear:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();
        const tableName = ctx.match[1];

        if (ctx.session.QueuePhotoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.QueuePhotoMessageId);
            ctx.session.QueuePhotoMessageId = undefined; 
        }

        clearTable(tableName);
        await ctx.callbackQuery.message.editText(`Таблица очищена`)
    })

    bot.callbackQuery(/deleteUserIn:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();
        const tableName = ctx.match[1];

        await ctx.callbackQuery.message.editText(`Напишите фамилию пользователя, которого нужно удалить:`);
        ctx.session.step = `waiting_for_${tableName}ToDelete`;
    })

    bot.callbackQuery('deleteBrigade', async (ctx) => {
        await ctx.answerCallbackQuery();
        const tableName = ctx.match[1];

        await ctx.callbackQuery.message.editText(`Напишите номер бригады, которую нужно удалить:`);
        ctx.session.step = `waiting_for_brigadeToDelete`;
    })

    bot.callbackQuery(/set(.*)Priority/, async (ctx) => {
        const priority = ctx.match[1]; // Получаем цвет из callback данных

        const priorities = {
            "Red": "Красный",
            "Yellow": "Жёлтый",
            "Green": "Зелёный",
            "Purple": "Санкции"
        }
        const surname = ctx.session.surname; 
        if (surname) {
            await setPriorityBySurname(surname, priorities[priority]); // Устанавливаем приоритет
            await ctx.editMessageText(`Приоритет пользователя ${surname} изменён на ${priorities[priority]}`, {
                reply_markup: getReturnKeyboard(false, 'KProg')
            });
        } else {
            await ctx.reply('Не удалось найти фамилию. Попробуйте ещё раз.');
        }
        ctx.session.step = null; // Завершаем процесс
    });

    bot.callbackQuery('updateKProg', async (ctx) => {
        await ctx.answerCallbackQuery();
        
        const subjectQueue = getQueue('KProg');

        const queue = [[[],[],[]], [[],[],[]]];
        let priorityIndex;
        let subgroupIndex, userSubgpoup;
        const config = await readConfig();
        const lessonType = config.KProgLessonType;

        if (lessonType == 0) {
            queue.pop();
            queue.flat(1);
        }

        priorityIndex = new Map();
        priorityIndex.set("Красный", 0);
        priorityIndex.set("Жёлтый", 1);
        priorityIndex.set("Зелёный", 2);
        priorityIndex.set("Санкции", 2);

        if (subjectQueue?.length) {
            subjectQueue.forEach(item => {
                if (lessonType == 0) {
                    subgroupIndex = 0;
                } else {
                    subgroupIndex = item.subgroup - 1;
                }
                queue[subgroupIndex][priorityIndex.get(item.priority)].push(item);
            });
        }

        queue.flat(2);
        insertIntoQueue(queue, 'KProg');
        await ctx.callbackQuery.message.editText(`Таблица КПрог обновлена`, {
            reply_markup: getReturnKeyboard(false, 'KProg')
        });
       
        console.log("Таблица КПрог обновлена");
    })
}

module.exports = { adminMenuCommand }