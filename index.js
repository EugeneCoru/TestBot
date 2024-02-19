//nodemon нужен для автомат  запуска кода 

require('dotenv').config();
const {Bot,Keyboard, GrammyError, HttpError,InlineKeyboard} = require('grammy');// подключаем классы из Гремми
const bot = new Bot(process.env.BOT_API_KEY);
const {GetRandomQuestion , GetCorrectAnswer }= require('./utilis');
 

//принимает название команды из тг
bot.command('start', async (ctx)=>{
    const startKey = new Keyboard().text('HTML').text('SCSS').row().text('JS').text('TS').row().text('React').text('Random').resized();
    await ctx.reply('Привет!\nКак я могу помочь?')
    await ctx.reply('С чего начнем?', {
        reply_markup: startKey
    });
});

//принимает сообщение в тг от пользователя
bot.hears(['HTML', 'SCSS', 'JS', 'TS', 'React', 'Random'], async (ctx)=>{
    
    const topic = ctx.message.text.toLowerCase();// получам кнопку, которую нажал пользователь
    //console.log(topic);
    const question = GetRandomQuestion(topic); //отправляем ее в функцию в утилитах, чтобы получить рандомный вопрос
    //console.log(question);
    let inlKey;

    if (question.hasOptions) {
      const btnRows = question.options.map((option) =>{
        return [InlineKeyboard.text(
          option.txt, 
            JSON.stringify({
              type: `${topic}-option`,
              isCorrect: option.isCorrect,
              queID: question.id,

        }))]
      });

      inlKey = InlineKeyboard.from(btnRows);
      
    }else{
      inlKey = new InlineKeyboard()
      .text("Ответ", JSON.stringify({
          type: topic,
          queID: question.id,
  
      }))
    }
    // .text("Отменить", 'cansel');
    await ctx.reply(question.text, {
        reply_markup: inlKey
    })
})

bot.on('callback_query:data', async (ctx) =>{
    const callBackData = JSON.parse(ctx.callbackQuery.data);// преобразовываем в объект строку 

    //когда вариантов ответа нет
    if (!callBackData.type.includes('option')) {
      const answer = GetCorrectAnswer(callBackData.type, callBackData.queID);
      await ctx.reply(answer, { 
        parse_mode: 'HTML',
      disable_web_page_preview: true, });//для того чтобы ссылка  которую вы вставите в ответе на вопрос отображалась(превью)
      await ctx.answerCallbackQuery();// для того чтобы ожидание заканчивалось
      return;
    }

    if (callBackData.isCorrect) {
      await ctx.reply('Верно!');
      await ctx.answerCallbackQuery();// для того чтобы ожидание завершилось
      return;
    }

    //пользоватлеь дал неверныый ответ
    const answer = GetCorrectAnswer(callBackData.type.split('-')[0], callBackData.queID); //разделяем строку по дифису
    ctx.reply(`Неверно! Правильный ответ: ${answer}`);
    await ctx.answerCallbackQuery();// для того чтобы ожидание завершилось
});




//обработка ошибок
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
    const e = err.error;
    if (e instanceof GrammyError) {
      console.error("Error in request:", e.description);
    } else if (e instanceof HttpError) {
      console.error("Could not contact Telegram:", e);
    } else {
      console.error("Unknown error:", e);
    }
  });


bot.start();