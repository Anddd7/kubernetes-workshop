const redis = require("redis");
const http = require("http");
const _url = require("url");

const client = redis.createClient(
  process.env.REDIS_URL || "redis://localhost:6379"
);
client.on("connect", () => console.log("connected"));

const handlerRedis = (res, query) => {
  const { key, value } = query;

  if (value) {
    client.set(key, value, (err, reply) => {
      console.log(err, reply);

      res.write(err || `set successful: [${key}:${value}]`);
      res.end();
    });
  } else {
    client.get(key, (err, reply) => {
      console.log(err, reply);

      res.write(err || `get [${key}] successful: [${reply}]`);
      res.end();
    });
  }
};

http
  .createServer((req, res) => {
    const url = req.url;
    const query = _url.parse(url, true).query;

    console.log(url, query);

    if (url == "/hello") {
      res.write(`Hello`);
      res.end();
      return;
    }

    if (url.startsWith("/redis")) {
      handlerRedis(res, query);
      return;
    }
  })
  .listen(8080);
