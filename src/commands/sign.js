const { returnToBZCH } = require('../bot/keyboards');
const { isInBZCH, getInfoById } = require('../database/database');
const { lessons } = require ('../lessons/lessons');
const { statusCheck } = require('./statusCheck');

function signCommand(bot) {
    bot.callbackQuery(/signLesson:(.+)/, async (ctx) => {
        if (await statusCheck(ctx)) {
            return;
        }
        await ctx.answerCallbackQuery();
        
        if (ctx.session.QueuePhotoMessageId) {
            await ctx.api.deleteMessage(ctx.chat.id, ctx.session.QueuePhotoMessageId);
            ctx.session.QueuePhotoMessageId = undefined;
        }

        const lessonType = ctx.match[1];
        let workType = "лабораторной \\(лабораторных\\)"
        if (lessonType == 'bzch') {
            workType = "ПЗ";
            const userInfo = await getInfoById(ctx.from.id.toString());
            isReg = await isInBZCH(userInfo.brigade_id); 
            if (isReg) {
                await ctx.callbackQuery.message.editText(
                    `*Один из членов вашей бригады уже записался в таблицу*`,
                    {
                        parse_mode: 'MarkdownV2',
                        reply_markup: returnToBZCH
                    }
                );
                return;
            }
        }
        await ctx.callbackQuery.message.editText(
            `*Запись на ${lessons.get(lessonType)}*\n\nВведите номер ${workType} , которую вы будете сдавать\\:`,
            {
                parse_mode: 'MarkdownV2',
            }
        );
    
        ctx.session.step = `waiting_for_${lessonType}Lab`;
    });
}

module.exports = {signCommand}