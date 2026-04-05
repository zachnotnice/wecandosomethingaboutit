const Redis = require("ioredis");

let client;

function getRedis() {
  if (!client) {
    client = new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
  }
  return client;
}

module.exports = { getRedis };
