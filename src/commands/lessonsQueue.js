const { InputFile } = require('grammy');

const {
    returnToQueueKeyboard, getReturnKeyboard
} = require('../bot/keyboards'); 

const { 
    getQueue
} = require('../database/database');

const { generateQueueTable } = require('../tables/tables');

function lessonsQueueCommand(bot) {
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
            status = "В таблице ещё никого нет"
            condition = true;
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

        await ctx.deleteMessage();

        let status = "";
        const queue = await getQueue('MCHA');
        let condition = false;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status = "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status = "Вы ещё не записались в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'MCHATable', 'МЧА');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/MCHATable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status = "_Пока никакой очереди нет_";
        }
        

        
        await ctx.reply(`💻 *Очередь на МЧА\n\n*`+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'mcha')
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
}

module.exports = { lessonsQueueCommand } 