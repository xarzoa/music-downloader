const { Bot, InputFile, InlineKeyboard } = require("grammy")
const { clearDownload, countSize} = require('./helpers/fileSystem')
const { dl } = require('./helpers/download')
const { start, serverInfo, musicInfo } = require('./helpers/messages')
const play = require('play-dl');
const env = require('dotenv').config()

const bot = new Bot(process.env['TOKEN']);

async function startThings(){

    await play.setToken({
      spotify:{
        client_id: process.env['ID'],
        client_secret : process.env['SECRET'],
        refresh_token : process.env['RFT'],
        market : "LK"
    }})

    await bot.api.setMyCommands([
      { command: 'start', description: 'Start the bot' },
      { command: 'server', description: 'Server info' },
      { command: 'inline', description: 'Search inline' }
    ])
}
startThings()

bot.command("start", (ctx) => {
  
  let keyBoard = new InlineKeyboard()
    .url('Dev', 'tg://resolve?domain=xarzoa')
    .url('Source', 'https://github.com/xarzoa/music-downloader')
    .row()
    .switchInlineCurrent("Search on Spotify")

  ctx.reply(start(ctx.message.from.first_name),
    {
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'HTML',
      reply_markup: keyBoard
    })

  bot.api.sendMessage(process.env['DUMP'], `${ctx.message.from.id}`);
})

bot.command("inline", (ctx) => {
  
  let keyBoard = new InlineKeyboard()
    .switchInlineCurrent("Search on Spotify")

  ctx.reply('<b>Search some music</b>',
    {
      reply_to_message_id: ctx.message.message_id,
      parse_mode: 'HTML',
      reply_markup: keyBoard
    })
})



try{
  bot.on("inline_query", async (ctx) => {
    try{

      const results = []

      if(ctx.update.inline_query.query){
        const search = await play.search(ctx.update.inline_query.query, {source: {spotify: 'track'}})
        search.forEach( res => {
          const artists = []
          res.artists.forEach(r => artists.push(r.name))
          const info = {
            name: res.name,
            album: res.album.name,
            released: res.album.release_date,
            artists: artists
          }
          results.push({
            type: "article",
            id: res.id,
            title:res.name,
            input_message_content: {
              message_text:res.url,
              parse_mode: "HTML",
            },
            reply_markup: new InlineKeyboard().url(
              res.name,
              res.url,
            ),
            url: res.url,
            description: musicInfo(info),
            photo_width: 128,
            photo_height: 128,
            thumb_url : res.thumbnail.url
          })
        })
      }else{
        results.push({
          type: "article",
          id: 'error',
          title: 'Something went wrong!',
          input_message_content: {
            message_text: '/server',
            parse_mode: "HTML",
          },
          description: "Somehing went wrong, Try again later."
        })
      }
      
      ctx.answerInlineQuery(results)

    }catch(e){
      console.error(e)
    }
  });
}catch(e){
  console.log(e)
}


bot.command('server', (ctx) => {

  ctx.reply( serverInfo(), {
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

    const fileSize = await countSize(song.dld)

    bot.api.sendChatAction(ctx.msg.chat.id, 'upload_audio')

    await ctx.replyWithDocument(new InputFile(song.dld), {
      reply_to_message_id: ctx.message.message_id,
      parse_mode: "HTML"
    })

    bot.api.deleteMessage(status.chat.id, status.message_id)

    clearDownload(song.dld)

  } else {

    bot.api.editMessageText(status.chat.id, status.message_id, 'Something went wrong.')

  }

}

bot.start();
