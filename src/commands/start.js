const { students } = require('../students/students');
const { 
    insertIntoDatabase, isRegistered 
} = require('../database/database');

const { showMenu } = require('./menu');

function startCommand(bot){
    bot.command('start', async (ctx) => {
        
        const isReg = await isRegistered(ctx.from.id);
        if (isReg) {
            await ctx.reply('👋 Привет! Это бот для записи на сдачу лабораторных работ.');
            showMenu(ctx);
            return;
        }
        if (!(students.has(ctx.from.username) || students.has(ctx.from.id.toString()))) {
            await ctx.reply('❗Вы не можете быть зарегестрированы! Напишите @ahahaharu, если возникли проблемы.');
            return;
        } else if (students.has(ctx.from.username)) {
            const data = students.get(ctx.from.username);
            await insertIntoDatabase(data.name, data.surname, ctx.from.username, ctx.msg.from.id.toString());
        } else {
            const data = students.get(ctx.from.id.toString());
            await insertIntoDatabase(data.name, data.surname, "", ctx.msg.from.id.toString());
        }

        await ctx.reply(`✅ Отлично! Вы зарегистрированы!`);
        showMenu(ctx);
    });
}

module.exports = { startCommand }