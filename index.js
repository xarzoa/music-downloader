const { Bot, InputFile, InlineKeyboard } = require("grammy")
const { clearDownload } = require('./clearDownload')
const { dl } = require('./download')
const fs = require('fs')
const os = require('os')
const env = require('dotenv').config()

const bot = new Bot(process.env['TOKEN']);

async function setCommands(){
    await bot.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'uptime', description: 'Server uptime' }
    ])
}

setCommands()

bot.command("start", (ctx) => {
  let keyBoard = new InlineKeyboard()
    .url('Dev', 'tg://resolve?domain=xarzoa')
    .row();
  ctx.reply(`Hola, Bitch! Send your Spotify URL, I'll download it.
  
<b>Maximum quality:</b> <code>128kbps</code>

<b>(Only tracks supported for now)</b>`,
    {
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'HTML',
      reply_markup: keyBoard
    })
  bot.api.sendMessage(process.env['DUMP'], `${ctx.message.from.id}`);
})


bot.command('uptime', (ctx) => {
  ctx.reply(`<b>Bot uptime:</b> ${((new Date(os.uptime() * 1000)).toUTCString().match(/(\d\d:\d\d:\d\d)/)[0])}`, {
    reply_to_message_id: ctx.message.message_id,
    parse_mode: 'HTML'
  })
});
bot.on("message::url", async (ctx) => {
  const message = ctx.message.text;
  if (message.startsWith("https://open.spotify.com/track")) {
    const aftersongid = message.split("/track/")[1]
    const songid = aftersongid.split("?")[0]
    download(songid, ctx)
  } else if (!message.includes('/track')) {
    ctx.reply("Albums and Playlists not supported yet.")
  } else {
    ctx.reply("Please use the link to download the song.")
  }
})

async function download(songid, ctx) {
  const status = await ctx.reply("Downloading...", {
    reply_to_message_id: ctx.message.message_id
  })
  const song = await dl(songid)
  if (song) {
    bot.api.editMessageText(status.chat.id, status.message_id, 'Downloaded')
    const { size } = await fs.statSync(song.dld)
    let fileSize = size / (1024 ** 2)
    bot.api.sendChatAction(ctx.msg.chat.id, 'upload_audio')
    await ctx.replyWithDocument(new InputFile(song.dld), {
      reply_to_message_id: ctx.message.message_id,
      caption: `Name: <code>${song.info.name}</code>
Album: <code>${song.info.album_name}</code>
Artist: <code>${song.info.artists[0]}</code>
Release Date: <code>${song.info.release_date}</code>
Size: <code>${fileSize.toFixed(2)}MB</code>`,
      parse_mode: "HTML"
    })
    bot.api.deleteMessage(status.chat.id, status.message_id)
    clearDownload(song.dld)
  } else {
    bot.api.editMessageText(status.chat.id, status.message_id, 'Something went wrong.')
  }

}

bot.start();