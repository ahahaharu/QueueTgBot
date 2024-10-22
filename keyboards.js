const { InlineKeyboard } = require('grammy');

// Определяем клавиатуры
const regKeyboard = new InlineKeyboard().text('Пройти регистрацию', 'reg');
const yesOrNoKeyboard = new InlineKeyboard()
    .text('Да', 'reg_yes')
    .text('Нет', 'reg_no');

module.exports = {
    regKeyboard,
    yesOrNoKeyboard
};
