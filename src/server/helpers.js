import "dotenv/config";
import Hapi from "@hapi/hapi";
import Joi from "joi";
import log4js from "log4js";
import SwaggerPlugins from "../plugins";
import * as handlebars from "handlebars";
import mongoose from "mongoose";
import CONFIG from "../config/index";
import Path from "path";
import BootStrap from "../utils/bootStrap";
import Routes from "../routes";
// import { Kafka } from "kafkajs";
// import RedisHelper from "../utils/redisHelper";
import async from "async";
import Service from "../services";

/**
 * @description Helper file for the server
 */
class ServerHelper {
  setGlobalAppRoot() {
    global.appRoot = Path.resolve(__dirname);
  }

  bootstrap() {
    BootStrap.bootstrapAdmin(function (err) {
      if (err) appLogger.debug(err);
    });
  }

  /**
   *
   * @param {Hapi.Server} server
   */
  addSwaggerRoutes(server) {
    server.route(Routes);
  }

  /**
   *
   * @param {Hapi.Server} server
   */
  attachLoggerOnEvents(server) {
    server.events.on("response", function (request) {
      appLogger.info(
        `${request.info.remoteAddress} : ${request.method.toUpperCase()} ${request.url.pathname
        } --> ${request.response.statusCode}`
      );
      appLogger.info("Request payload:", request.payload);
    });
  }

  /**
   * @returns {Hapi.Server} A Hapi Server
   */
  createServer() {
    let server = new Hapi.Server({
      app: {
        name: process.env.APP_NAME || "default",
      },
      port: process.env.HAPI_PORT || 8000,
      routes: {
        cors: {
          additionalHeaders: ["X-API-KEY", "X-SIGNATURE"]
        }
      },
    });
    server.validator(Joi);
    return server;
  }

  /**
   * @author Sanchit Dang
   * @description Adds Views to the server
   * @param {Hapi.Server} server
   */
  addViews(server) {
    server.views({
      engines: {
        html: handlebars,
      },
      relativeTo: __dirname,
      path: "../../views",
    });
  }

  /**
   * @author Sanchit Dang
   * @description sets default route for the server
   * @param {Hapi.Server} server HAPI Server
   * @param {String} defaultRoute Optional - default route
   */
  setDefaultRoute(server, defaultRoute) {
    if (defaultRoute === undefined) defaultRoute = "/";
    server.route({
      method: "GET",
      path: defaultRoute,
      handler: (req, res) => {
        return res.view("welcome");
      },
    });
  }

  /**
   *
   * @param {Hapi.Server} server HAPI Server
   */
  async registerPlugins(server) {
    await server.register(SwaggerPlugins, {}, (err) => {
      if (err) server.log(["error"], "Error while loading plugins : " + err);
      else server.log(["info"], "Plugins Loaded");
    });
  }

  configureLog4js = () => {
    // Configuration for log4js.
    log4js.configure({
      appenders: {
        App: { type: "console" },
        Upload_Manager: { type: "console" },
        Socket_Manager: { type: "console" },
        Token_Manager: { type: "console" },
        Mongo_Manager: { type: "console" },
        Kafka_Manager: { type: "console" },
        Redis_Manager: { type: "console" },
      },
      categories: {
        default: { appenders: ["App"], level: "trace" },
        Upload_Manager: { appenders: ["Upload_Manager"], level: "trace" },
        Socket_Manager: { appenders: ["Socket_Manager"], level: "trace" },
        Token_Manager: { appenders: ["Token_Manager"], level: "trace" },
        Mongo_Manager: { appenders: ["Mongo_Manager"], level: "trace" },
        Kafka_Manager: { appenders: ["Kafka_Manager"], level: "info" },
        Redis_Manager: { appenders: ["Redis_Manager"], level: "trace" },
      },
    });
    // Global Logger variables for logging
    global.appLogger = log4js.getLogger("App");
    global.uploadLogger = log4js.getLogger("Upload_Manager");
    global.socketLogger = log4js.getLogger("Socket_Manager");
    global.tokenLogger = log4js.getLogger("Token_Manager");
    global.mongoLogger = log4js.getLogger("Mongo_Manager");
    global.kafkaLogger = log4js.getLogger("Kafka_Manager");
    global.redisLogger = log4js.getLogger("Redis_Manager");
  };

  connectRedisDB() {
    RedisHelper.connectRedis(function (err) {
      if (err) appLogger.debug(err);
    });
  }

  /**
   *
   * @param {Hapi.Server} server
   */
  async startServer(server) {
    try {
      await server.start();
      appLogger.info("Server running on %s", server.info.uri);
    } catch (error) {
      appLogger.fatal(error);
    }
  }

  connectMongoDB() {
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    mongoose.set("useCreateIndex", true);
    mongoose.set("useFindAndModify", false);
    mongoose.connect(CONFIG.DB_CONFIG.mongo.URI, mongooseOptions, (err) => {
      if (err) {
        mongoLogger.debug("DB Error: ", err);
        process.exit(1);
      } else mongoLogger.info("MongoDB Connected");
    });
  }
}

const instance = new ServerHelper();
export default instance;
