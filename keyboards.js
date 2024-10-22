const { InlineKeyboard } = require('grammy');

// Определяем клавиатуры
const regKeyboard = new InlineKeyboard().text('📋 Пройти регистрацию', 'reg');
// const yesOrNoKeyboard = new InlineKeyboard()
//     .text('Да', 'reg_yes')
//     .text('Нет', 'reg_no');
const menuKeyboard = new InlineKeyboard()
    .text('👤 Профиль', 'profile').row()
    .text('📒 Очереди', 'queue').row();

const returnToMenuKeyboard = new InlineKeyboard().text('↩️Вернуться в меню', 'returnToMenu');

module.exports = {
    regKeyboard,
    menuKeyboard,
    returnToMenuKeyboard
};
