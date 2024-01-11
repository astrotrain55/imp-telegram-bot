import { keyboard, keyboardButtons } from './keyboard/index.mjs';
import api from './api/fetch.mjs';
import bot from './api/bot.mjs';

bot.on('text', (msg) => {
  let cont = true;

  if (msg.text === keyboardButtons.advice.title) {
    getAdvice(msg);
    cont = false;
  }

  if (msg.text === keyboardButtons.quote.title) {
    getQuote(msg);
    cont = false;
  }

  keyboardButtons.rand.forEach((obj) => {
    if (msg.text === obj.title) {
      getRand(msg, obj.id);
      cont = false;
    }
  });

  if (cont) {
    bot.sendMessage(msg.chat.id, '😈')
      .then(console.info)
      .catch(console.error);
    bot.sendMessage(msg.chat.id, `${msg.chat.first_name}, не понимаю тебя!`)
      .then(console.info)
      .catch(console.error);
  }
});

async function getQuote(msg) {
  const text = await api.getQuote();
  console.log('getQuote', text);
  await bot.sendMessage(msg.chat.id, text, {
    parseMode: 'html',
    replyMarkup: bot.keyboard(keyboard),
    replyToMessage: msg.message_id,
  });
}

async function getAdvice(msg) {
  const text = await api.getAdvice();
  console.log('getAdvice', text);
  await bot.sendMessage(msg.chat.id, text, {
    replyMarkup: bot.keyboard(keyboard),
    replyToMessage: msg.message_id,
  });
}

async function getRand(msg, buttonId) {
  const text = await api.getRand(buttonId);
  console.log('getRand', text);
  await bot.sendMessage(msg.chat.id, text, {
    replyMarkup: bot.keyboard(keyboard),
    replyToMessage: msg.message_id,
  });
}

export default bot;
