const { InlineKeyboard } = require('grammy');

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


function getReturnKeyboard(condition, lessonType, isQueue) {
    const kprogPriorityKeyBoard = new InlineKeyboard();

    if (condition) {
        kprogPriorityKeyBoard.text('✍️Записаться', `signLesson:${lessonType}`).row()
    } else {
        if (isQueue && lessonType != 'bzch') {
            kprogPriorityKeyBoard.text('❌Я не приду на пару', `deleteFrom:${lessonType}`).row()
        }
    }

    if (lessonType === 'kprog') {
        kprogPriorityKeyBoard.text("📝Приоритеты", "priorityInfo").row()
    } 

    if (lessonType === 'bzch') {
        kprogPriorityKeyBoard.text("📝Приоритеты", "BZCHpriorityInfo").row()
    }

    kprogPriorityKeyBoard
    .text('↩️Вернуться к очередям', 'queue').row()

    return kprogPriorityKeyBoard;
}

function confirmDelete(lessonType) {
    const confirmKeyboard = new InlineKeyboard()
        .text("Да", `yesFor:${lessonType}`)
        .text("Нет", `noFor:${lessonType}`)

    return confirmKeyboard;
}

function doWithTable(lesson) {
    return new InlineKeyboard()
        .text('Удалить пользователя из таблицы', `deleteUserIn:${lesson}`).row()
        .text('Очистить таблицу', `clear:${lesson}`).row()

}

const selectQueueKeyboard = new InlineKeyboard()
    .text('💻КПрог', 'changeKprog').row()
    .text('🖥ИСП', 'changeIsp').row()
    .text('📈ПЗМА', 'changePzma').row()
    .text('👴🏻МЧА', 'changeMcha').row()
    .text('🌡БЖЧ', 'changeBzch').row()
    .text('↩️Вернуться в меню', 'adminmenu').row()

const returnToMenuKeyboard = new InlineKeyboard().text('↩️Вернуться в меню', 'returnToMenu');

const returnToQueueKeyboard = new InlineKeyboard().text('↩️Вернуться к очередям ', 'queue');

const returnToKProg = new InlineKeyboard().text('↩️Вернуться к КПрог ', 'kprog');
const returnToISP = new InlineKeyboard().text('↩️Вернуться к ИСП ', 'isp');
const returnToPZMA = new InlineKeyboard().text('↩️Вернуться к ПЗМА ', 'pzma');
const returnToMCHA = new InlineKeyboard().text('↩️Вернуться к МЧА ', 'mcha');
const returnToBZCH = new InlineKeyboard().text('↩️Вернуться к БЖЧ ', 'bzch');

function createStatusKeyboard(subject) {
    return new InlineKeyboard()
        .text("🟩Сдал(-а)", `passed:${subject}`).row()
        .text("🟨Подошёл(-ла), но не сдал(-а)", `notPassed:${subject}`).row()
        .text("🟥Не успел(-а) подойти", `notPsbl:${subject}`).row();
}


const adminKeyboard = new InlineKeyboard()
    .text("Поставить приоритет", "setPr").row()
    .text("Изменить таблицу", "queueToChange").row()
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
    menuKeyboard,
    returnToMenuKeyboard,
    queueKeyboard,
    returnToQueueKeyboard,
    returnToKProg,
    returnToISP,
    returnToPZMA,
    returnToMCHA,
    returnToBZCH,
    createSignButton,
    createStatusKeyboard,
    adminKeyboard,
    setPriorityKeyboard,
    getReturnKeyboard,
    selectQueueKeyboard,
    doWithTable,
    confirmDelete
};
