const redis = require("redis");
const config = require("../config");

class Redis {
  constructor() {
    this.host = config.redis.host;
    this.port = config.redis.port;
    this.connected = false;
    this.client = null;
  }

  async getConnection() {
    let obj = this;

    if (obj.connected) {
      return obj.client;
    } else {
      obj.client = redis.createClient({
        host: obj.host,
        port: obj.port,
      });
      obj.client.on("connect", function () {
        console.log("Redis Connecting!");
      });

      obj.client.on("ready", function () {
        console.log("Redis Ready!");
        obj.connected = true;
      });

      obj.client.on("error", function () {
        console.log("Error: redis disconnected!");
        obj.connected = false;
      });

      obj.client.on("end", function () {
        console.log("End: redis connection ended!");
        obj.connected = false;
      });

      try {
        await obj.client.connect();
        obj.connected = true;
      } catch (e) {
        console.log("redis connect exception caught: " + e);
        return null;
      }

      return obj.client;
    }
  }
}

module.exports = new Redis();
