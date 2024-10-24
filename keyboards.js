const { InlineKeyboard } = require('grammy');

// Определяем клавиатуры
const regKeyboard = new InlineKeyboard().text('📋 Пройти регистрацию', 'reg');
// const yesOrNoKeyboard = new InlineKeyboard()
//     .text('Да', 'reg_yes')
//     .text('Нет', 'reg_no');
const menuKeyboard = new InlineKeyboard()
    .text('👤 Профиль', 'profile').row()
    .text('📒 Очереди', 'queue').row()

const queueKeyboard = new InlineKeyboard()
    .text('💻КПрог', 'kprog').row()
    .text('🖥ИСП', 'isp').row()
    .text('📈ПЗМА', 'pzma').row()
    .text('👴🏻МЧА', 'mcha').row()
    .text('🌡БЖЧ', 'bzch').row()
    .text('↩️Вернуться в меню', 'returnToMenu').row()

const returnToMenuKeyboard = new InlineKeyboard().text('↩️Вернуться в меню', 'returnToMenu');

const returnToQueueKeyboard = new InlineKeyboard().text('↩️Вернуться к очередям ', 'queue');

module.exports = {
    regKeyboard,
    menuKeyboard,
    returnToMenuKeyboard,
    queueKeyboard,
    returnToQueueKeyboard
};
