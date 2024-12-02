const { lessons } = require("../lessons/lessons")

async function statusCheck(ctx) {
    const step = ctx.session.step;

    // Проверяем, начинается ли step с "waiting_for_"
    if (step && step.startsWith("waiting_for_")) {
        // Извлекаем ключ предмета из step
        const lessonKey = step.replace("waiting_for_", "");

        // Получаем название предмета из lessons
        const lessonName = lessons.get(lessonKey);

        // Если название предмета найдено, отправляем сообщение
        if (lessonName) {
            await ctx.reply(
                `Идёт запись на ${lessonName}! \nПожалуйста, окончите запись, чтобы пользоваться другими командами.`,
                { parse_mode: 'MarkdownV2' }
            );
            return true;
        }
    }

    return false;
}

module.exports = { statusCheck }