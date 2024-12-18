const { InputFile } = require('grammy');

const {
    getReturnKeyboard,
    confirmDelete
} = require('../bot/keyboards'); 

const { 
    getQueue,
    getInfoById,
    insertIntoQueue,
    clearTable
} = require('../database/database');

const { generateQueueTable} = require('../tables/tables');
const {returnConfigs} = require ('../utils/config');
const { lessons } = require('../lessons/lessons');
const { getTime } = require('../bot/getTime');

const emojies = new Map();
emojies.set("KProg", "💻");
emojies.set("ISP", "🖥");
emojies.set("PZMA", "📈");
emojies.set("MCHA", "👴🏻");
emojies.set("BZCH", "🌡");

function lessonsQueueCommand(bot) {
    async function showQueue(ctx, subject) {
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
        const queue = await getQueue(subject);
        let condition = false;
        let configs = await returnConfigs()
        let lessonType = configs.get(subject).lessonType === 0 ? "" : configs.get(subject).lessonType === 1 ? "\\(1 подгруппа\\)" : "\\(2 подгруппа\\)";
        if (subject === 'BZCH') {
            lessonType = "";
        }
        status = `${configs.get(subject).date} ${lessonType}\n\n`;

        if (queue?.length) {
            let index;
            if (subject === 'BZCH') {
                const userInfo = await getInfoById(ctx.from.id.toString());
                index = queue.findIndex(item => item.brigade_id == userInfo.brigade_id);
            } else {
                index = queue.findIndex(item => item.tg_id == ctx.from.id);
            }
            if (index !== -1) {
                let type;
                if (subject === 'BZCH') {
                    type = "Ваша бригада записана таблицу\\! ";
                } else {
                    type = "Вы записаны в таблицу\\! ";
                }
                status += type+"Ваше место в очереди: "+(+index+1);
            } else {
                if (subject === 'BZCH') {
                    status += "Ваша бригада ещё не записалась в таблицу";
                } else {
                    status += "Вы ещё не записались в таблицу";
                }
                condition = true;
            }

            await generateQueueTable(queue, subject);
            let photoMessage = await ctx.replyWithPhoto(new InputFile(`./src/tables/${subject}Table.png`));
            ctx.session.QueuePhotoMessageId = photoMessage.message_id;
        } else {
            status += "_В таблице ещё никого нет_"
            condition = true;
        }
        
        await ctx.reply(`${emojies.get(subject)} *Очередь на ${lessons.get(subject)}* `+status, {
            parse_mode: 'MarkdownV2',
            reply_markup: getReturnKeyboard(condition, subject, true)
        })
    }
    bot.callbackQuery('kprog', async (ctx) => {
        await showQueue(ctx, 'KProg');
    });

    bot.callbackQuery('isp', async (ctx) => {
        await showQueue(ctx, 'ISP');
    });

    bot.callbackQuery('pzma', async (ctx) => {
        await showQueue(ctx, 'PZMA');
    });

    bot.callbackQuery('mcha', async (ctx) => {
        await showQueue(ctx, 'MCHA');
    });

    bot.callbackQuery('bzch', async (ctx) => {
        await showQueue(ctx, 'BZCH');
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

        let queue = await getQueue(lessonType);
        const userInfo = await getInfoById(ctx.from.id.toString());
        queue = queue.filter(item => item.tg_id != ctx.from.id);

        if(queue?.length) {
            insertIntoQueue(queue, lessonType);
        } else {
            clearTable(lessonType);
        }

        console.log(getTime()+" "+userInfo.surname+" удалил себя из таблицы "+lessons.get(lessonType));
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