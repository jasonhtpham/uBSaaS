// import RedisHelper from "../utils/redisHelper";
// const redisClient = RedisHelper.getRedisClient();

// /**
//  * @author Navit Choudhary
//  * @description Generic Redis Service Template
//  */
// export default class GenericRedisService {
//   /**
//    * @author Navit Choudhary
//    * @description Insert data in redis
//    * @param {Object} key
//    * @param {Object} data
//    * @param {Function} callback
//    */
//   createRecord(key, data, callback) {
//     redisClient.set(key, JSON.stringify(data), callback);
//   }

//   /**
//    * @author Navit Choudhary
//    * @description get data from redis
//    * @param {Object} key
//    * @param {Function} callback
//    */
//   getRecord(key, callback) {
//     redisClient.get(key, callback);
//   }

//   /**
//    * @author Navit Choudhary
//    * @description Get Redis Key
//    * @param {Object} criteria
//    * @param {Function} callback
//    */
//   getKeys(criteria, callback) {
//     redisClient.keys(criteria, callback);
//   }

//   /**
//    * @author Navit Choudhary
//    * @description flush redis DB
//    * @param {Function} callback
//    */
//   flushDb(callback) {
//     redisClient.flushdb(callback);
//   }
// }
