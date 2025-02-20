const { lessons } = require("../../data/lessons");

async function statusCheck(ctx) {
  const step = ctx.session.step;
  if (step && step.startsWith("waiting_for_")) {
    const lessonKey = step.replace("waiting_for_", "");

    const lessonName = lessons.get(lessonKey);

    if (lessonName) {
      await ctx.reply(
        `Идёт запись на ${lessonName}! \nПожалуйста, окончите запись, чтобы пользоваться другими командами.`,
        { parse_mode: "MarkdownV2" }
      );
      return true;
    }
  }

  return false;
}

module.exports = { statusCheck };
