const { lessons } = require("../../data/lessons");

async function statusCheck(ctx) {
  const step = ctx.session.step;
  console.log(step);
  if (step && step.startsWith("waiting_for_")) {
    const lessonKey = step.replace("waiting_for_", "").replace("Lab", "");

    const lesson = lessons.find((ls) => ls.name === lessonKey);

    if (lessonKey) {
      await ctx.reply(
        `Идёт запись на ${lesson.title}\\! \nПожалуйста, окончите запись, чтобы пользоваться другими командами\\.`,
        { parse_mode: "MarkdownV2" }
      );
      return true;
    }
  }

  return false;
}

module.exports = { statusCheck };
