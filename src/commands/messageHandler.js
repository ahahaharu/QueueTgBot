const config = require('../../config.json');

const {
    returnToKProg, setPriorityKeyboard
} = require('../bot/keyboards'); 

const { 
    getInfoById, insertToKProg, getKProgQueue, isInUsers, 
} = require('../database/database');

const { sendMessageForAll } = require('./delayedMsgs');

function messageHandler(bot) {
    bot.on('message', async (ctx) => {
        const regex = /^(?:[1-8](?:[,\s]?[1-8])*)$/;

        if (ctx.session.step === "waiting_for_kprogLab") {
            let lab = ctx.message.text;

            if(!(regex.test(lab) && lab.length < 20)) {
                await ctx.reply("*Неверное значение\\!* Введите номера лаб верно\\!\n\n_Например\\: 1\\, 2_", {
                    parse_mode: 'MarkdownV2'
                }
                );
                return;
            }

            const KProgQueue = await getKProgQueue();
            const userInfo = await getInfoById(ctx.from.id.toString());
            const queue = [
                [[],[],[]],
                [[],[],[]]
            ]

            let subgroupIndex, userSubgpoup;
            if (config.KProgLessonType == 0) {
                queue.pop();
                queue.flat(1);
                userSubgpoup = 0;
            } else {  
                userSubgpoup = userInfo.subgroup - 1;
            }


            priorityIndex = new Map();
            priorityIndex.set("Красный", 0);
            priorityIndex.set("Жёлтый", 1);
            priorityIndex.set("Зелёный", 2);
            priorityIndex.set("Санкции", 2);
           
            if (KProgQueue?.length) {
                KProgQueue.forEach(item => {
                    if (config.KProgLessonType == 0) {
                        subgroupIndex = 0;
                    } else {
                        subgroupIndex = item.subgroup - 1;
                    }
                    queue[subgroupIndex][priorityIndex.get(item.priority)].push(item); 
                });
            }
            
            queue[userSubgpoup][priorityIndex.get(userInfo.priority)].push({
                tg_id: userInfo.tg_id,
                surname: userInfo.surname,
                labs: lab,
                priority: userInfo.priority,
                subgroup: userInfo.subgroup
            });

            if (config.KProgLessonType == 2) {
                [queue[0], queue[1]] = [queue[1], queue[0]];
            }

            insertToKProg(queue.flat(2));

            await ctx.reply(`✅ Отлично! Вы записаны!`, {
                reply_markup: returnToKProg
            });

            ctx.session.step = null;
            
        } else if (ctx.session.step === "waiting_for_prioritySurname") {
            let surname = ctx.message.text;

            let isUserRegistered = await isInUsers(surname);
            if (isUserRegistered) {
                ctx.session.surname = surname;
                ctx.session.step = 'waiting_for_priority';
                await ctx.reply('Какой приоритет выставить?', {
                    reply_markup: setPriorityKeyboard
                })
            } else {
                await ctx.reply('❌ *Такого студента нет в группе\\!* Введите корректную фамилию:', {
                    parse_mode: 'MarkdownV2'
                });
            }

            ctx.session.step = null;

        } else if (ctx.session.step === "waiting_for_adminMessage") {
            let text = ctx.message.text;

            await sendMessageForAll(bot, text);

            ctx.session.step = null;
        } else {
            await ctx.reply('❓ Я не понимаю это сообщение. Для начала нажмите /start или перейдите в меню /menu');
        }
    });
}

module.exports = {messageHandler}