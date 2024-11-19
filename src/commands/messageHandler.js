
const { inputCheck }= require('../bot/inputCheck');

const {
    returnToKProg, returnToISP, setPriorityKeyboard,
    returnToPZMA, returnToMCHA,
    returnToBZCH
} = require('../bot/keyboards'); 

const { 
    getInfoById, insertIntoQueue, getQueue, isInUsers,
    clearTable, 
} = require('../database/database');

const { sendMessageForAll } = require('./delayedMsgs');
const {readConfig, writeConfig} = require ('../utils/config')

function messageHandler(bot) {
    bot.on('message', async (ctx) => {
        

        if (ctx.session.step === "waiting_for_kprogLab") {
            let lab = ctx.message.text;

            

            if(!(ctx.message.text && lab.length < 20 && inputCheck(lab))) {
                await ctx.reply("*Неверное значение\\!* Введите номера лаб верно\\!\n\n_Например\\: 1\\, 2_", {
                    parse_mode: 'MarkdownV2'
                }
                );
                return;
            }

            const KProgQueue = await getQueue('KProg');
            const userInfo = await getInfoById(ctx.from.id.toString());
            const queue = [
                [[],[],[]],
                [[],[],[]]
            ]
            config = await readConfig();

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

            insertIntoQueue(queue.flat(2), 'KProg');

            await ctx.reply(`✅ Отлично! Вы записаны!`, {
                reply_markup: returnToKProg
            });

            ctx.session.step = null;
            
        } else if (ctx.session.step === "waiting_for_ispLab") {
            let lab = ctx.message.text;

            if(!(ctx.message.text && lab.length < 20 && inputCheck(lab))) {
                await ctx.reply("*Неверное значение\\!* Введите номера лаб верно\\!\n\n_Например\\: 1\\, 2_", {
                    parse_mode: 'MarkdownV2'
                }
                );
                return;
            }

            const ISPQueue = await getQueue('ISP');
            const userInfo = await getInfoById(ctx.from.id.toString());
            const queue = [
                [], []
            ]
            config = await readConfig();

            let subgroupIndex, userSubgpoup;
            if (config.ISPLessonType == 0) {
                queue.pop();
                queue.flat(1);
                userSubgpoup = 0;
            } else {  
                userSubgpoup = userInfo.subgroup - 1;
            }
           
            if (ISPQueue?.length) {
                ISPQueue.forEach(item => {
                    if (config.ISPLessonType == 0) {
                        subgroupIndex = 0;
                    } else {
                        subgroupIndex = item.subgroup - 1;
                    }
                    queue[subgroupIndex].push(item); 
                });
            }
            
            queue[userSubgpoup].push({
                tg_id: userInfo.tg_id,
                surname: userInfo.surname,
                labs: lab,
                subgroup: userInfo.subgroup
            });

            if (config.ISPLessonType == 2) {
                [queue[0], queue[1]] = [queue[1], queue[0]];
            }

            insertIntoQueue(queue.flat(1), 'ISP');

            await ctx.reply(`✅ Отлично! Вы записаны!`, {
                reply_markup: returnToISP
            });

            ctx.session.step = null;
        } else if (ctx.session.step === "waiting_for_pzmaLab") {
            let lab = ctx.message.text;

            if(!(ctx.message.text && lab.length < 20 && inputCheck(lab))) {
                await ctx.reply("*Неверное значение\\!* Введите номера лаб верно\\!\n\n_Например\\: 1\\, 2_", {
                    parse_mode: 'MarkdownV2'
                }
                );
                return;
            }

            const PZMAQueue = await getQueue('PZMA');
            const userInfo = await getInfoById(ctx.from.id.toString());
            const queue = [
                [], []
            ]
            config = await readConfig();

            let subgroupIndex, userSubgpoup;
            if (config.PZMALessonType == 0) {
                queue.pop();
                queue.flat(1);
                userSubgpoup = 0;
            } else {  
                userSubgpoup = userInfo.subgroup - 1;
            }
           
            if (PZMAQueue?.length) {
                PZMAQueue.forEach(item => {
                    if (config.PZMALessonType == 0) {
                        subgroupIndex = 0;
                    } else {
                        subgroupIndex = item.subgroup - 1;
                    }
                    queue[subgroupIndex].push(item); 
                });
            }
            
            queue[userSubgpoup].push({
                tg_id: userInfo.tg_id,
                surname: userInfo.surname,
                labs: lab,
                subgroup: userInfo.subgroup
            });

            if (config.PZMALessonType == 2) {
                [queue[0], queue[1]] = [queue[1], queue[0]];
            }

            insertIntoQueue(queue.flat(1), 'PZMA');

            await ctx.reply(`✅ Отлично! Вы записаны!`, {
                reply_markup: returnToPZMA
            });

            ctx.session.step = null;
        } else if (ctx.session.step === "waiting_for_mchaLab") {
            let lab = ctx.message.text;

            if(!(ctx.message.text && lab.length < 20 && inputCheck(lab))) {
                await ctx.reply("*Неверное значение\\!* Введите номера лаб верно\\!\n\n_Например\\: 1\\, 2_", {
                    parse_mode: 'MarkdownV2'
                }
                );
                return;
            }

            const MCHAQueue = await getQueue('MCHA');
            const userInfo = await getInfoById(ctx.from.id.toString());
            const queue = [
                [], []
            ]
            config = await readConfig();

            let subgroupIndex, userSubgpoup;
            if (config.MCHALessonType == 0) {
                queue.pop();
                queue.flat(1);
                userSubgpoup = 0;
            } else {  
                userSubgpoup = userInfo.subgroup - 1;
            }
           
            if (MCHAQueue?.length) {
                MCHAQueue.forEach(item => {
                    if (config.MCHALessonType == 0) {
                        subgroupIndex = 0;
                    } else {
                        subgroupIndex = item.subgroup - 1;
                    }
                    queue[subgroupIndex].push(item); 
                });
            }
            
            queue[userSubgpoup].push({
                tg_id: userInfo.tg_id,
                surname: userInfo.surname,
                labs: lab,
                subgroup: userInfo.subgroup
            });

            if (config.MCHALessonType == 2) {
                [queue[0], queue[1]] = [queue[1], queue[0]];
            }

            insertIntoQueue(queue.flat(1), 'MCHA');

            await ctx.reply(`✅ Отлично! Вы записаны!`, {
                reply_markup: returnToMCHA
            });

            ctx.session.step = null;
        } else if (ctx.session.step === "waiting_for_bzchLab") {
            let lab = ctx.message.text;

            if(!(ctx.message.text && lab.length < 20 && inputCheck(lab))) {
                await ctx.reply("*Неверное значение\\!* Введите номера лаб верно\\!\n\n_Например\\: 1\\, 2_", {
                    parse_mode: 'MarkdownV2'
                }
                );
                return;
            }

            let BZCHQueue = await getQueue('BZCH');
            const userInfo = await getInfoById(ctx.from.id.toString());
            config = await readConfig();
 
            if (!BZCHQueue) {
                BZCHQueue = [];
            }
            BZCHQueue.push({
                brigade_id: userInfo.brigade_id,
                labs: lab
            });

            insertIntoQueue(BZCHQueue, 'BZCH');

            await ctx.reply(`✅ Отлично! Вы записаны!`, {
                reply_markup: returnToBZCH
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
        } else if (ctx.session.step === 'waiting_for_KProgToDelete') {
            let surname = ctx.message.text;

            let queue = await getQueue('KProg');
            
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if(index === -1) {
                await ctx.reply('Такого пользователя нет в таблице');
            }
            queue = queue.filter(item => item.surname !== surname);

            if(queue?.length) {
                insertIntoQueue(queue, 'KProg');
            } else {
                clearTable('KProg');
            }

            await ctx.reply('Пользователь удалён из таблицы');
        } else if (ctx.session.step === 'waiting_for_ISPToDelete') {
            let surname = ctx.message.text;

            let queue = await getQueue('ISP');
            
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if(index === -1) {
                await ctx.reply('Такого пользователя нет в таблице');
            }
            queue = queue.filter(item => item.surname !== surname);

            if(queue?.length) {
                insertIntoQueue(queue, 'ISP');
            } else {
                clearTable('ISP');
            }

            await ctx.reply('Пользователь удалён из таблицы');
        } else if (ctx.session.step === 'waiting_for_PZMAToDelete') {
            let surname = ctx.message.text;

            let queue = await getQueue('PZMA');
            
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if(index === -1) {
                await ctx.reply('Такого пользователя нет в таблице');
            }
            queue = queue.filter(item => item.surname !== surname);

            if(queue?.length) {
                insertIntoQueue(queue, 'PZMA');
            } else {
                clearTable('PZMA');
            }

            await ctx.reply('Пользователь удалён из таблицы');
        } else if (ctx.session.step === 'waiting_for_MCHAToDelete') {
            let surname = ctx.message.text;

            let queue = await getQueue('MCHA');
            
            const index = queue.findIndex(item => item.tg_id == ctx.from.id);
            if(index === -1) {
                await ctx.reply('Такого пользователя нет в таблице');
            }
            queue = queue.filter(item => item.surname !== surname);

            if(queue?.length) {
                insertIntoQueue(queue, 'MCHA');
            } else {
                clearTable('MCHA');
            }

            await ctx.reply('Пользователь удалён из таблицы');
        } else {
            await ctx.reply('❓ Я не понимаю это сообщение. Для начала нажмите /start или перейдите в меню /menu');
        }
    });
}

module.exports = {messageHandler}