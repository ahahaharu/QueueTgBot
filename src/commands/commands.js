const { InputFile } = require('grammy');
const config = require('../../config.json');

const {
    menuKeyboard, returnToMenuKeyboard,
    queueKeyboard, returnToQueueKeyboard, returnToKProg,
    adminKeyboard, setPriorityKeyboard, getReturnKeyboard
} = require('../bot/keyboards'); 

const { students } = require('../students/students');
const { 
    insertIntoDatabase, isRegistered, getInfoById, getAllUsers, 
    insertToKProg, getQueue, setPriority, isInUsers, 
    setPriorityBySurname 
} = require('../database/database');

const { generatePriorityTable, generateQueueTable } = require('../tables/tables');
const { lessons } = require ('../lessons/lessons');
const { sendMessageForAll } = require('./delayedMsgs');

const { menuCommand } = require('./menu');
const { startCommand } = require("./start.js");
const { adminMenuCommand } = require('./adminMenu.js');
const { messageHandler } = require('./messageHandler.js');
const { signCommand } = require('./sign.js');
const { priorityCommand } = require('./priority.js');
const { lessonsQueueCommand } = require('./lessonsQueue.js');



function commands(bot) {
    bot.use((ctx, next) => {
        ctx.session.photoMessageId ??= null;
        ctx.session.QueuePhotoMessageId ??= null;
        return next();
    });

    startCommand(bot);

    menuCommand(bot);

    adminMenuCommand(bot);

    lessonsQueueCommand(bot);

    signCommand(bot);

    priorityCommand(bot);

    messageHandler(bot);

}

module.exports = { commands };
