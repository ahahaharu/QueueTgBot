async function statusCheck(ctx) {
    if (ctx.session.step === "waiting_for_kprogLab") {
        await ctx.reply("Идёт запись на КПрог\\! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
        return true;
    } else if (ctx.session.step === "waiting_for_ispLab") {
        await ctx.reply("Идёт запись на ИСП\\! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
    } else if (ctx.session.step === "waiting_for_pzmaLab") {
        await ctx.reply("Идёт запись на ПЗМА\\! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
        return true;
    } else if (ctx.session.step === "waiting_for_mchaLab") {
        await ctx.reply("Идёт запись на МЧА\\! \nПожалуйста, окончите запись, чтобы пользоваться другими командами."), {
            parse_mode: 'MarkdownV2'
        }
        return true;
    }
    return false;
}

module.exports = { statusCheck }