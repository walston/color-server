const fs = require("fs");
const { Buffer } = require("buffer");
const Koa = require("koa");
const app = new Koa();

const PORT = process.env.PORT || 9090;
const DELAY = parseInt(process.env.DELAY) > -1 ? process.env.DELAY : 1000;

app.use(ctx => {
  console.debug(ctx.request.path);

  const gif_header = Buffer.from("GIF87a");
  const size = Buffer.from([1, 0, 1, 0, 0xf0, 0, 0]);
  const color = Buffer.from([rando(), rando(), rando()]);
  const bitmap = Buffer.from([
    0x26,
    0x45,
    0xc9,
    0x21,
    0xf9,
    0x04,
    0x01,
    0x00,
    0x00,
    0x01,
    0x00,
    0x2c,
    0x00,
    0x00,
    0x00,
    0x00,
    0x01,
    0x00,
    0x01,
    0x00,
    0x00,
    0x02,
    0x02,
    0x44,
    0x01,
    0x00,
    0x3b
  ]);

  hold().then(() => {
    ctx.response.headers = { "Content-Type": "image/gif" };
    ctx.response.body = Buffer.concat([gif_header, size, color, bitmap], 43);
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
