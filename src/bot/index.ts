import { keyboard, keyboardButtons } from './keyboard';
import api from './api/fetch';
import { bot, message, Markup, Input } from './api/bot';

bot.start(async (ctx: any) => {
  if (ctx.chat.type === 'supergroup') {
    await ctx.replyWithHTML(`Привет, чат <b>${ctx.chat.title}</b>! 😈`, Markup.keyboard(keyboard));
  } else if (ctx.chat.type === 'private') {
    await ctx.replyWithHTML(
      `Будь как дома, путник <b>${ctx.chat.first_name}</b>! 😈`,
      Markup.keyboard(keyboard),
    );
  }
});

bot.help((ctx) =>
  ctx.replyWithHTML(`
/start — Запуск/перезапуск бота
/cat — Запросить котика
/item — Что-то непонятное
/help — Список возможных команд
Если отправить боту статичную геолокацию, он ответит погодой
`),
);

bot.command('cat', (ctx) => api.getCat().then((url) => ctx.replyWithPhoto(Input.fromURL(url))));

bot.command('item', (ctx) => api.getList().then((text) => ctx.replyWithHTML(text)));

bot.command('keyboard', (ctx) => ctx.reply('Держи клавиатуру ⌨️', Markup.keyboard(keyboard)));

bot.on(message('sticker'), (ctx) => ctx.reply('👀'));

bot.on(message('location'), async (ctx: any) => {
  type AnswerType = {
    name: string;
    wind: {
      speed: number;
    };
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
      pressure: number;
    };
  };
  const { latitude, longitude, live_period } = ctx.message.location;
  if (live_period) {
    await ctx.reply('Автообновляемая геолокация не поддерживается, отправьте статичную 🌐');
    return;
  }
  const answer = (await api.getWeather(latitude, longitude)) as AnswerType;
  const wind = answer.wind.speed > 0 ? `<i>Ветер</i> ${answer.wind.speed} м/с` : 'Штиль';
  const text = `
<b>${answer.name}</b>
<i>Температура</i> ${answer.main.temp} ℃
<i>По ощущению</i> ${answer.main.feels_like} ℃
<i>Влажность</i> ${answer.main.humidity}%
<i>Давление</i> ${answer.main.pressure} мм рт. ст.
${wind}
  `;
  await ctx.replyWithHTML(text, {
    reply_to_message_id: ctx.message.message_id,
  });
});

bot.on(message('text'), async (ctx: any) => {
  try {
    if (ctx.message.text === keyboardButtons.advice.title) {
      await getAdvice(ctx);
    } else if (ctx.message.text === keyboardButtons.quote.title) {
      await getQuote(ctx);
    } else {
      await ctx.reply(`${ctx.from.first_name}, не понимаю тебя!`, {
        reply_to_message_id: ctx.message.message_id,
      });
      await ctx.reply('😈');
    }
  } catch (e) {
    console.warn(e);
  }
});

async function getQuote(ctx: any) {
  const text = await api.getQuote();
  await ctx.replyWithHTML(text, {
    reply_to_message_id: ctx.message.message_id,
  });
}

async function getAdvice(ctx: any) {
  const text = await api.getAdvice();
  await ctx.reply(text, {
    reply_to_message_id: ctx.message.message_id,
  });
}

export { bot };
