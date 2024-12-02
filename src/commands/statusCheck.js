async function statusCheck(ctx) {
    if (ctx.session.step === "waiting_for_KProgLab") {
        await ctx.reply("Идёт запись на КПрог! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
        return true;
    } else if (ctx.session.step === "waiting_for_ISPLab") {
        await ctx.reply("Идёт запись на ИСП! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
    } else if (ctx.session.step === "waiting_for_PZMALab") {
        await ctx.reply("Идёт запись на ПЗМА! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
        return true;
    } else if (ctx.session.step === "waiting_for_MCHALab") {
        await ctx.reply("Идёт запись на МЧА! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
        return true;
    } else if (ctx.session.step === "waiting_for_BZCHLab") {
        await ctx.reply("Идёт запись на БЖЧ! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
        return true;
    }
    return false;
}

module.exports = { statusCheck }