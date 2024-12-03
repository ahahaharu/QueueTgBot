const { InputFile } = require('grammy');

const {
    returnToQueueKeyboard, getReturnKeyboard,
    confirmDelete
} = require('../bot/keyboards'); 

const { 
    getQueue,
    getInfoById,
    insertIntoQueue,
    clearTable
} = require('../database/database');

const { generateQueueTable, generateBZCHTable } = require('../tables/tables');
const {readConfig} = require ('../utils/config')

//TODO: решить проблему с копи пастом очередей

function lessonsQueueCommand(bot) {
    bot.callbackQuery('kprog', async (ctx) => {
        await ctx.answerCallbackQuery();

        if (ctx.session.photoMessageId) {
            try {
                await ctx.api.deleteMessage(ctx.chat.id, ctx.session.photoMessageId);
            } catch (error) {
                if (error.message.includes("message can't be deleted for everyone")) {
                    console.log("Сообщение уже удалено или не может быть удалено.");
                } else {
                    console.error("Произошла другая ошибка:", error);
                }
            }
            ctx.session.photoMessageId = undefined;
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

        let status = "";
        const queue = await getQueue('KProg');
        let condition = false;
        config = await readConfig();
        const lessonType = config.KProgLessonType === 0 ? "" : config.KProgLessonType === 1 ? "\\(1 подгруппа\\)" : "\\(2 подгруппа\\)";
        status = `${config.KProgDate} ${lessonType}\n\n`;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status += "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status += "Вы ещё не записались в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'KProg');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/KProgTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status += "_В таблице ещё никого нет_"
            condition = true;
        }
        
        await ctx.reply(`💻 *Очередь на КПрог* `+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'KProg', true)
        })
    });

    bot.callbackQuery('isp', async (ctx) => {
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
        let condition = false;
        config = await readConfig();
        const lessonType = config.ISPLessonType === 0 ? "" : config.ISPLessonType === 1 ? "\\(1 подгруппа\\)" : "\\(2 подгруппа\\)";
        status = `${config.ISPDate} ${lessonType}\n\n`;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status += "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status += "Вы ещё не записались в таблицу"
                condition = true;
            }
            
            await generateQueueTable(queue, 'ISP');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/ISPTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status += "_В таблице ещё никого нет_"
            condition = true;
        }
        

        
        await ctx.reply(`💻 *Очередь на ИСП* `+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'ISP', true)
        })
    });

    bot.callbackQuery('pzma', async (ctx) => {
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
        let condition = false;
        config = await readConfig();
        const lessonType = config.PZMALessonType === 0 ? "" : config.PZMALessonType === 1 ? "\\(1 подгруппа\\)" : "\\(2 подгруппа\\)";
        status = `${config.PZMADate} ${lessonType}\n\n`;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status += "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status += "Вы ещё не записались в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'PZMA');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/PZMATable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status += "_В таблице ещё никого нет_"
            condition = true;
        }
        

        
        await ctx.reply(`💻 *Очередь на ПЗМА* `+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'PZMA', true)
        })
    });

    bot.callbackQuery('mcha', async (ctx) => {
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
        let condition = false;
        config = await readConfig();
        const lessonType = config.MCHALessonType === 0 ? "" : config.MCHALessonType === 1 ? "\\(1 подгруппа\\)" : "\\(2 подгруппа\\)";
        status = `${config.MCHADate} ${lessonType}\n\n`;

        if (queue?.length) {
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if (index !== -1) {
                status += "Вы записаны в таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status += "Вы ещё не записались в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'MCHA');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/MCHATable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status += "_В таблице ещё никого нет_"
            condition = true;
        }
        

        
        await ctx.reply(`💻 *Очередь на МЧА* `+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'MCHA', true)
        })
    });

    bot.callbackQuery('bzch', async (ctx) => {
        await ctx.answerCallbackQuery();

        if (ctx.session.photoMessageId) {
            try {
                await ctx.api.deleteMessage(ctx.chat.id, ctx.session.photoMessageId);
            } catch (error) {
                if (error.message.includes("message can't be deleted for everyone")) {
                    console.log("Сообщение уже удалено или не может быть удалено.");
                } else {
                    console.error("Произошла другая ошибка:", error);
                }
            }
            ctx.session.photoMessageId = undefined;
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

        let status = "";
        const queue = await getQueue('BZCH');
        let condition = false;
        config = await readConfig();
        status = `${config.BZCHDate}\n\n`;
        const userInfo = await getInfoById(ctx.from.id.toString());

        if (queue?.length) {
            const index = queue.findIndex(item => item.brigade_id == userInfo.brigade_id);
            if (index !== -1) {
                status += "Ваша бригада записана таблицу\\! Ваше место в очереди: "+(+index+1);
            } else {
                status += "Ваша бригада ещё не записалась в таблицу"
                condition = true;
            }

            await generateQueueTable(queue, 'BZCH');
            let photoMessage = await ctx.replyWithPhoto(new InputFile("./src/tables/BZCHTable.png"));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status += "_В таблице ещё никого нет_"
            condition = true;
        }
        
        await ctx.reply(`🌡 *Очередь на БЖЧ* `+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, 'BZCH', true)
        })
    });

    bot.callbackQuery(/deleteFrom:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();
        
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
            ctx.session.QueuePhotoMessageId = undefined;
        }

        const lessonType = ctx.match[1];
        
        await ctx.callbackQuery.message.editText(
            `*Удалить вас с таблицы?*`,
            {
                parse_mode: 'MarkdownV2',
                reply_markup: confirmDelete(lessonType)
            }
        );
    
    });

    bot.callbackQuery(/yesFor:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();

        const lessonType = ctx.match[1];

        const lessonsToDelete = new Map();

        let queue = await getQueue(lessonType);
        queue = queue.filter(item => item.tg_id != ctx.from.id);

        if(queue?.length) {
            insertIntoQueue(queue, lessonType);
        } else {
            clearTable(lessonType);
        }

        await ctx.callbackQuery.message.editText(
            `*Вы удалены из таблицы*`,
            {
                parse_mode: 'MarkdownV2',
                reply_markup: getReturnKeyboard(false, lessonType)
            }
        );
    });

    bot.callbackQuery(/noFor:(.+)/, async (ctx) => {
        await ctx.answerCallbackQuery();

        const lessonType = ctx.match[1];

        await ctx.callbackQuery.message.editText(
            `*Вы не были удалены из таблицы*`,
            {
                parse_mode: 'MarkdownV2',
                reply_markup: getReturnKeyboard(false, lessonType)
            }
        );
    });
}

module.exports = { lessonsQueueCommand } 