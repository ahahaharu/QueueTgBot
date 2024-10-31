const { lessons } = require ('../lessons/lessons');

function signCommand(bot) {
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
}

module.exports = {signCommand}