// import 'dotenv/config';
// import redis from "redis";

// const redisClient = redis.createClient(
//   process.env.REDIS_PORT);

// const getRedisClient = () => {
//     return redisClient;
// }


// const connectRedis = async () => {
//     redisClient.on('error', function (err) {
//         redisLogger.fatal("Redis Connection Error : ", err);
//     });
//     redisClient.on('connect', function () {
//         redisLogger.info('Redis Connected');
//     });
//     redisClient.on('ready', function () {
//         redisLogger.info('Redis Running');
//     });
// }

// export default {
//     getRedisClient,
//     connectRedis
// }