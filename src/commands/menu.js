const { menuKeyboard } = require('../bot/keyboards'); 

function showMenu(ctx) {
    ctx.reply(`📖 *Меню:*`, {
        parse_mode: 'MarkdownV2',
        reply_markup: menuKeyboard
    });
}

module.exports = {showMenu}