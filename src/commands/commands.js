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
