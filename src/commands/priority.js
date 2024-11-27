const { InputFile } = require('grammy');

const {
    returnToKProg, getReturnKeyboard,
    returnToBZCH
} = require('../bot/keyboards'); 

const { 
    getAllUsers, setPriority,
    getBZCHPriorityTable,
    setBZCHPriority,
    getInfoById,
    getQueue,
    isInBZCH,
    getBZCHStatus,
    setPriorityStatus
} = require('../database/database');

const { generatePriorityTable, generateBZCHPriorityTable } = require('../tables/tables');



function priorityCommand(bot) {
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

    bot.callbackQuery('BZCHpriorityInfo', async (ctx) => {
        await ctx.answerCallbackQuery();
    
        if (ctx.session.QueuePhotoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.QueuePhotoMessageId);
            ctx.session.QueuePhotoMessageId = undefined;
        }
        await ctx.deleteMessage();
    
        let data = await getBZCHPriorityTable();
        await generateBZCHPriorityTable(data);
    
        // Отправляем изображение
        let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/BZCHpriorityTable.png"));
        ctx.session.photoMessageId = photoMessage.message_id;
    
        // Отправляем текст
        await ctx.reply(
            '💻 *Как работают приоритеты?*\n\nПриоритеты необходимы для того,' 
            +'чтобы ,бригады, которые не успели сдать ПЗ, имели возможность' 
            +'сделать это в первую очередь на следующей паре\\.\n\n'
            +'*Есть несколько видов приоритетов:*\n\n'
            +'🟥 __*Красный*__ \\- приоритет, который даётся в том случае, когда человек __*вообще не имел возможности подойти*__ и сдать \\(не успел по очереди\\)\n'
            +'🟨 __*Жёлтый*__ \\- приоритет, который даётся, если человек хотя бы раз за пару __*попробовал сдать*__ ПЗ, но __*не сдал*__\n'
            +'🟩 __*Зелёный*__ \\- даётся в том случае, когда студент __*сдал*__ ПЗ '
            +'_\\(если сдавалось 2 ПЗ, но была сдана только одна, то всё равно даётся зелёный приоритет\\)_\n'
            +'🟪 __*Фиолетовый*__ \\- __*санкции*__, которые накладываются в том случае, когда студент решил с кем\\-то поменяться очередью во время сдачи ПЗ\n\n'
            +'Таблица приоритетов представленна выше',
            {
                parse_mode: 'MarkdownV2',
                reply_markup: returnToBZCH
            }
        );
    });

    bot.callbackQuery(/(passed|notPassed|notPsbl):(\w+)/, async (ctx) => {
        await ctx.answerCallbackQuery();
        
        const action = ctx.match[1];
        const subject = ctx.match[2]; 
        
        let priority;
        let message;

        const userInfo = await getInfoById(ctx.from.id.toString())

        if (subject == 'bzch') {
            if (await getBZCHStatus(userInfo.brigade_id)) {
                await ctx.callbackQuery.message.editText("Один из членов вашей бригады уже поставил приоритет", {
                    parse_mode: 'MarkdownV2',
                    reply_markup: getReturnKeyboard(false, 'bzch')
                });
            } else {
                await setPriorityStatus(userInfo.brigade_id, true);
            }
            
        }
    
        if (action === 'passed') {
            priority = "Зелёный";
            message = `*🎉 Поздравляю со сдачей\\!*\n\n_🟩 Вам выдан зелёный приоритет_`;
        } else if (action === 'notPassed') {
            priority = "Жёлтый";
            message = `*😔 Ничего страшного\\!*\nНа следующей паре вы сможете сдать чуть первее других\n\n🟨 _Вам выдан жёлтый приоритет_`;
        } else if (action === 'notPsbl') {
            priority = "Красный";
            message = `*☹️ Очень жаль, что вы не успели\\.*\nНа следующей паре вы сможете сдать лабораторную работу одним\\(\\-ой\\) из первых\n\n_🟥 Вам выдан красный приоритет_`;
        }
        
        
        if (subject == 'kprog') {
            await setPriority(userInfo.tg_id, priority);
        } else {
            await setBZCHPriority(userInfo.brigade_id, priority)
        }
        
        await ctx.callbackQuery.message.editText(message, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(false, subject)
        });
    });
}

module.exports = {priorityCommand}