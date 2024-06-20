require("dotenv").config();
const {
  Bot,
  GrammyError,
  HttpError,
  Keyboard,
  InlineKeyboard,
} = require("grammy");
const { hydrate } = require("@grammyjs/hydrate");

const bot = new Bot(process.env.BOT_API_KEY);
bot.use(hydrate());

bot.api.setMyCommands([
  {
    command: "start",
    description: "start bot",
  },
  {
    command: "menu",
    description: "menu",
  },
]);

bot.command("start", async (ctx) => {
  await ctx.react("🥰");
  await ctx.reply(
    "Hi! Im bot. My admin: <a href='https://t.me/t1uman3'>t1uman3</a>",
    {
      parse_mode: "HTML",
    }
  );
});

const menuKeyboard = new InlineKeyboard()
  .text("status order", "order-status")
  .text("get support", "support");
const backKeyboard = new InlineKeyboard().text("<back to menu", "back");

bot.command("menu", async (ctx) => {
  await ctx.reply("chose menu item", {
    reply_markup: menuKeyboard,
  });
  await ctx.answerCallbackquery();
});

bot.callbackQuery("order-status", async (ctx) => {
  await ctx.callbackQuery.message.editText("status order: in road", {
    reply_markup: backKeyboard,
  });
});
bot.callbackQuery("support", async (ctx) => {
  await ctx.callbackQuery.message.editText("describe the problem", {
    reply_markup: backKeyboard,
  });
});
bot.callbackQuery("back", async (ctx) => {
  await ctx.callbackQuery.message.editText("chose menu item", {
    reply_markup: menuKeyboard,
  });
});
bot.command(["say_hello", "say_hi", "hello"], async (ctx) => {
  await ctx.reply("Hello!");
});

bot.hears("id", async (ctx) => {
  await ctx.reply(ctx.from.id);
});

bot.hears("keepass", async (ctx) => {
  await ctx.reply("СкпаврКУ");
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Unknown error:", e);
  }
});

bot.start();
