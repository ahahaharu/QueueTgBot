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


function getKProgPriorityKeyboard(condition, lessonType) {
    const kprogPriorityKeyBoard = new InlineKeyboard();

    if (condition) {
        kprogPriorityKeyBoard.text('✍️Записаться', `signLesson:${lessonType}`).row()
    }


    kprogPriorityKeyBoard
    .text("📝Приоритеты", "priorityInfo").row()
    .text('↩️Вернуться к очередям', 'queue').row()

    return kprogPriorityKeyBoard;
}

const returnToMenuKeyboard = new InlineKeyboard().text('↩️Вернуться в меню', 'returnToMenu');

const returnToQueueKeyboard = new InlineKeyboard().text('↩️Вернуться к очередям ', 'queue');

const returnToKProg = new InlineKeyboard().text('↩️Вернуться к КПрог ', 'kprog');

const kprogStatusKeyboard = new InlineKeyboard()
    .text("🟩Сдал(-а)", "passed").row()
    .text("🟨Подошёл(-ла), но не сдал(-а)", "notPassed").row()
    .text("🟥Не успел(-а) подойти", "notPsbl").row()


const adminKeyboard = new InlineKeyboard()
    .text("Поставить приоритет", "setPr").row()
    .text("Отправить сообщение всем", "sendMsg").row()

const setPriorityKeyboard = new InlineKeyboard()
    .text("🟥 Красный", 'setRedPriority').row()
    .text("🟨 Жёлтый", 'setYellowPriority').row()
    .text("🟩 Зелёный", 'setGreenPriority').row()
    .text("🟪 Санкции", 'setPurplePriority').row()

function createSignButton(lessonType) {
    return new InlineKeyboard().text('✍️Записаться', `signLesson:${lessonType}`);
}



module.exports = {
    regKeyboard,
    menuKeyboard,
    returnToMenuKeyboard,
    queueKeyboard,
    returnToQueueKeyboard,
    returnToKProg,
    createSignButton,
    kprogStatusKeyboard,
    adminKeyboard,
    setPriorityKeyboard,
    getKProgPriorityKeyboard
};
