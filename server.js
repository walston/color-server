const fs = require("fs");
const { Buffer } = require("buffer");
const Koa = require("koa");
const app = new Koa();
const Gif = require("./gif");

const PORT = process.env.PORT || 9090;
const DELAY = parseInt(process.env.DELAY) > -1 ? process.env.DELAY : 1000;

app.use(ctx => {
  console.debug(ctx.request.path);

  const color = [rando(), rando(), rando()];
  const path = /([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})\.gif$/.exec(
    ctx.request.path || ""
  );
  if (path != null) {
    const [, r, g, b] = path;
    color[0] = parseInt(r, 16);
    color[1] = parseInt(g, 16);
    color[2] = parseInt(b, 16);
  }

  return hold().then(() => {
    ctx.response.headers = { "Content-Type": "image/gif" };
    ctx.response.body = Gif(...color);
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
