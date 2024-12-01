const {
    menuKeyboard, returnToMenuKeyboard, queueKeyboard
} = require('../bot/keyboards'); 

const { 
    isRegistered, getInfoById
} = require('../database/database');
const { statusCheck } = require('./statusCheck');



function showMenu(ctx) {
    ctx.reply(`📖 *Меню:*`, {
        parse_mode: 'MarkdownV2',
        reply_markup: menuKeyboard
    });
}

function menuCommand(bot) {
    bot.command('menu', async (ctx) => {
        if (await statusCheck(ctx)) {
            return;
        }

        let isUserRegistered = await isRegistered(ctx.msg.from.id);
            if (!isUserRegistered) {
                await ctx.reply('❗Вы ещё не зарегестрированы! Напишите /start для регистрации');
                return;
            }

        if (ctx.session.step === 'waiting_for_name') {
            await ctx.reply('❗Вы ещё не завершили регистрацию. Пожалуйста, введите фамилию и имя.');
            return;
        }

        showMenu(ctx);
    })

    bot.callbackQuery('profile', async (ctx) => {
        await ctx.answerCallbackQuery();
        
        try {
            let userInfo = await getInfoById(ctx.from.id.toString());
            if (userInfo) {
                await ctx.callbackQuery.message.editText(`📊 *Ваш профиль:*\n\n*Фамилия:* ${userInfo.surname}\n*Имя:* ${userInfo.name}\n*№ подгруппы:* ${userInfo.subgroup}`, {
                    parse_mode: 'MarkdownV2',
                    reply_markup: returnToMenuKeyboard
                });
            } else {
                console.log("Пользователь с таким tg_id не найден.");
            }
        } catch (error) {
            console.error("Ошибка при получении информации:", error);
        }
    
        
    });
    
    bot.callbackQuery('returnToMenu', async (ctx) => {
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`📖 *Меню:*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: menuKeyboard
        })
    })
    
    bot.callbackQuery('queue', async (ctx) => {
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
    
        await ctx.answerCallbackQuery();
        await ctx.callbackQuery.message.editText(`📒 *Очереди на предметы*`, {
            parse_mode: 'MarkdownV2',
            reply_markup: queueKeyboard
        })
    });
}





module.exports = {showMenu, menuCommand}