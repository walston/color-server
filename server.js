const fs = require("fs");
const { Buffer } = require("buffer");
const Koa = require("koa");
const app = new Koa();
const Gif = require('./gif');

const PORT = process.env.PORT || 9090;
const DELAY = parseInt(process.env.DELAY) > -1 ? process.env.DELAY : 1000;

app.use(ctx => {
  console.debug(ctx.request.path);

  return hold().then(() => {
    ctx.response.headers = { "Content-Type": "image/gif" };
    ctx.response.body = Gif(rando(), rando(), rando());
  });
});

app.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
  console.log(`delaying responses for ${DELAY}ms`);
});

function hold() {
  return new Promise(resolve => setTimeout(resolve, DELAY));
}

function read(color) {
  fs.readFile(
    "/Users/nathan.walston/Downloads/" + color + ".gif",
    (err, data) => {
      if (!err) console.log(color + ":" + data.length + ":\n", data);
      else console.error(err);
    }
  );
}

function rando() {
  return Math.floor(Math.random() * 256);
}
