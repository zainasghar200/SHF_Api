const redis = require("redis");

//Redis Local Development Configuration
// const client = redis.createClient();

// Redis Heroku Production Configuration
const client = redis.createClient({
  host: sails.config.custom.redis.host,
  port: sails.config.custom.redis.port,
  password: sails.config.custom.redis.password,
  db: sails.config.custom.redis.db
});

client.on("connect", () => {
  console.log("Redis :: Client Connected");
  // only for local testing
  client.keys("*", (err, data) => console.log(data));
});

client.on("error", error => {
  console.log(`Redis :: ${error}`);
});

module.exports = {
  set: (key, val, done) => {
    client.set(key, JSON.stringify(val), redis.print);
    done();
  },

  get: (key, done) => {
    client.get(key, (error, result) => {
      if (error) {
        console.log(`Redis :: ${error}`);
        throw error;
      }
      return done(JSON.parse(result));
    });
  },

  del: (key, done) => {
    client.del(key, (err, response) => {
      if (err) {
        console.log("Redis :: " + err);
        throw err;
      }
      if (response === 1) {
        console.log("Redis :: Deleted Successfully!");
        return done(response);
      } else {
        console.log("Redis :: Unable to delete!");
      }
    });
  }
};
