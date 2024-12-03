const { InputFile } = require('grammy');

const {
    returnToKProg, getReturnKeyboard,
    returnToBZCH,
    returnToLessonQueue
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

const { generatePriorityTable, generateBZCHPriorityTable, generateQueueTable } = require('../tables/tables');


function priorityCommand(bot) {
    bot.callbackQuery(/priorityInfoFor:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();

        const subject = ctx.match[1];
    
        if (ctx.session.QueuePhotoMessageId) {
            try {
                await ctx.api.deleteMessage(ctx.chat.id, ctx.session.QueuePhotoMessageId);
            } catch (error) {
                if (error.message.includes("message can't be deleted for everyone")) {
                    console.log("Сообщение уже удалено или не может быть удалено.");
                } else {
                    console.error("Произошла другая ошибка:", error);
                }
            }
            ctx.session.QueuePhotoMessageId = undefined; // Сбрасываем ID
        }
        try {
            await ctx.deleteMessage();
        } catch (error) {
            if (error.message.includes("message can't be deleted for everyone")) {
                console.log("Сообщение уже удалено или не может быть удалено.");
            } else {
                console.error("Произошла другая ошибка:", error);
            }
        }
        
        let data;
        if (subject === 'KProg') {
            data = await getAllUsers();
            data.sort((a, b) => {
                if (a.surname < b.surname) return -1;
                if (a.surname > b.surname) return 1;
                return 0;
            });
        } else {
            data = await getBZCHPriorityTable();
        }
        await generateQueueTable(data, subject, true);
    
        let photoMessage = await ctx.replyWithPhoto(new InputFile(`./src/tables/${subject}priorityTable.png`));
        ctx.session.photoMessageId = photoMessage.message_id;
    
        await ctx.reply(
            '💻 *Как работают приоритеты?*\n\nПриоритеты необходимы для того,' 
            +`чтобы студенты, которые не успели сдать ${subject === 'KProg' ? 'лабораторную работу' : 'ПЗ'}, имели возможность` 
            +'сделать это в первую очередь на следующей паре\\.\n\n'
            +'*Есть несколько видов приоритетов:*\n\n'
            +'🟥 __*Красный*__ \\- приоритет, который даётся в том случае, когда человек __*вообще не имел возможности подойти*__ и сдать \\(не успел по очереди\\)\n'
            +`🟨 __*Жёлтый*__ \\- приоритет, который даётся, если человек хотя бы раз за пару __*попробовал сдать*__ ${subject === 'KProg' ? 'лабораторную работу' : 'ПЗ'}, но __*не сдал*__\n`
            +`🟩 __*Зелёный*__ \\- даётся в том случае, когда студент __*сдал*__ ${subject === 'KProg' ? 'лабораторную работу' : 'ПЗ'} `
            +`_\\(если сдавалось 2 ${subject === 'KProg' ? 'лабы' : 'ПЗ'}, но была сдана только одна, то всё равно даётся зелёный приоритет\\)_\n`
            +`🟪 __*Фиолетовый*__ \\- __*санкции*__, которые накладываются в том случае, когда студент решил с кем\\-то поменяться очередью во время сдачи ${subject === 'KProg' ? 'лаб' : 'ПЗ'}\n\n`
            +'Таблица приоритетов представленна выше',
            {
                parse_mode: 'MarkdownV2',
                reply_markup: returnToLessonQueue(subject)
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

        if (subject == 'BZCH') {
            if (await getBZCHStatus(userInfo.brigade_id)) {
                await ctx.callbackQuery.message.editText("Один из членов вашей бригады уже поставил приоритет", {
                    parse_mode: 'MarkdownV2',
                    reply_markup: getReturnKeyboard(false, 'bzch')
                });
                return;
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
        
        
        if (subject == 'KProg') {
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