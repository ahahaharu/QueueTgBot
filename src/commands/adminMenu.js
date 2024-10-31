const { InputFile } = require('grammy');

const {
    adminKeyboard, getKProgPriorityKeyboard,
    selectQueueKeyboard,
    doWithTable
} = require('../bot/keyboards'); 

const { generateQueueTable } = require('../tables/tables');

const { setPriorityBySurname, getQueue, clearTable } = require('../database/database');


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

        await ctx.deleteMessage();

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
                reply_markup: getKProgPriorityKeyboard(false, 'kprog')
            });
        } else {
            await ctx.reply('Не удалось найти фамилию. Попробуйте ещё раз.');
        }
        ctx.session.step = null; // Завершаем процесс
    });
}

module.exports = { adminMenuCommand }