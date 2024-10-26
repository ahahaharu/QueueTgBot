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

const kprogPriorityKeyBoard = new InlineKeyboard()
    .text("📝Приоритеты", "priorityInfo").row()
    .text('↩️Вернуться к очередям', 'queue').row()

const returnToMenuKeyboard = new InlineKeyboard().text('↩️Вернуться в меню', 'returnToMenu');

const returnToQueueKeyboard = new InlineKeyboard().text('↩️Вернуться к очередям ', 'queue');

const returnToKProg = new InlineKeyboard().text('↩️Вернуться к КПрог ', 'kprog');

function createSignButton(lessonType) {
    return new InlineKeyboard().text('✍️Записаться', `signLesson:${lessonType}`);
}


module.exports = {
    regKeyboard,
    menuKeyboard,
    returnToMenuKeyboard,
    queueKeyboard,
    returnToQueueKeyboard,
    kprogPriorityKeyBoard,
    returnToKProg,
    createSignButton
};
