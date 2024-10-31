const { InputFile } = require('grammy');
const config = require('../../config.json');

const {
    menuKeyboard, returnToMenuKeyboard,
    queueKeyboard, returnToQueueKeyboard, returnToKProg,
    adminKeyboard, setPriorityKeyboard, getReturnKeyboard
} = require('../bot/keyboards'); 

const { students } = require('../students/students');
const { 
    insertIntoDatabase, isRegistered, getInfoById, getAllUsers, 
    insertToKProg, getQueue, setPriority, isInUsers, 
    setPriorityBySurname 
} = require('../database/database');

const { generatePriorityTable, generateQueueTable } = require('../tables/tables');
const { lessons } = require ('../lessons/lessons');
const { sendMessageForAll } = require('./delayedMsgs');

const { menuCommand } = require('./menu');
const { startCommand } = require("./start.js");
const { adminMenuCommand } = require('./adminMenu.js');
const { messageHandler } = require('./messageHandler.js');



function commands(bot) {
    bot.use((ctx, next) => {
        ctx.session.photoMessageId ??= null;
        ctx.session.QueuePhotoMessageId ??= null;
        return next();
    });

    startCommand(bot);

    menuCommand(bot);

    adminMenuCommand(bot);

    bot.callbackQuery('kprog', async (ctx) => {
        await ctx.answerCallbackQuery();

        if (ctx.session.photoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.photoMessageId);
            ctx.session.photoMessageId = undefined;
        }
        await ctx.deleteMessage();

        let status = "";
        const queue = await getQueue('KProg');
        let condition = false;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status = "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status = "Вы ещё не записались в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'KProgTable', 'КПрог');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/KProgTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на КПрог\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'kprog')
        })
    });

    bot.callbackQuery('isp', async (ctx) => {
        await ctx.answerCallbackQuery();

        await ctx.deleteMessage();

        let status = "";
        const queue = await getQueue('ISP');
        let condition = false;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status = "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status = "Вы ещё не записались в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'ISPTable', 'ИСП');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/ISPTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на ИСП\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'isp')
        })
    });

    bot.callbackQuery('pzma', async (ctx) => {
        await ctx.answerCallbackQuery();

        await ctx.deleteMessage();

        let status = "";
        const queue = await getQueue('PZMA');
        let condition = false;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status = "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status = "Вы ещё не записались в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'PZMATable', 'ПЗМА');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/PZMATable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на ПЗМА\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'pzma')
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

    bot.callbackQuery('priorityInfo', async (ctx) => {
        await ctx.answerCallbackQuery();
    
        if (ctx.session.QueuePhotoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.QueuePhotoMessageId);
            ctx.session.QueuePhotoMessageId = undefined; // Сбрасываем ID
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
    

    
     
    bot.callbackQuery(/signLesson:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();
        
        if (ctx.session.QueuePhotoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.QueuePhotoMessageId);
            ctx.session.QueuePhotoMessageId = undefined;
        }

        const lessonType = ctx.match[1];
        
        await ctx.callbackQuery.message.editText(
            `*Запись на ${lessons.get(lessonType)}*\n\nВведите номер лаборатной \\(лабораторных\\), которую вы будете сдавать\\:`,
            {
                parse_mode: 'MarkdownV2',
            }
        );
    
        ctx.session.step = `waiting_for_${lessonType}Lab`;
    });

    bot.callbackQuery('passed', async (ctx) => {
        await ctx.answerCallbackQuery();

        await setPriority(ctx.from.id.toString(), "Зелёный");
        await ctx.callbackQuery.message.editText(`*🎉 Поздравляю со сдачей\\!*\n\n_🟩 Вам выдан зелёный приоритет_`, {
            parse_mode: 'MarkdownV2',
            reply_markup: getKProgPriorityKeyboard(false, 'kprog')
        })
    });

    bot.callbackQuery('notPassed', async (ctx) => {
        await ctx.answerCallbackQuery();

        await setPriority(ctx.from.id.toString(), "Жёлтый");
        await ctx.callbackQuery.message.editText(`*😔 Ничего страшного\\!*\nНа следующей паре вы сможете сдать чуть первее других\n\n🟨 _Вам выдан жёлтый приоритет_`, {
            parse_mode: 'MarkdownV2',
            reply_markup: getKProgPriorityKeyboard(false, 'kprog')
        })
    });

    bot.callbackQuery('notPsbl', async (ctx) => {
        await ctx.answerCallbackQuery();

        await setPriority(ctx.from.id.toString(), "Красный");
        await ctx.callbackQuery.message.editText(`*☹️ Очень жаль, что вы не успели\\.*\nНа следующей паре вы сможете сдать лабораторную работу одним\\(\\-ой\\) из первых\n\n_🟥 Вам выдан красный приоритет_`, {
            parse_mode: 'MarkdownV2',
            reply_markup: getKProgPriorityKeyboard(false, 'kprog')
        })
    });

    messageHandler(bot);

}

module.exports = { commands };
