import ServerHelper from "./helpers";
import SocketManager from "../lib/socketManager";
import SSOManager from "../lib/ssoManager";

/**
 * @author Sanchit Dang
 * @description Initilize HAPI Server
 */
const initServer = async () => {
  //Create Server
  const server = ServerHelper.createServer();

  //Register All Plugins
  await ServerHelper.registerPlugins(server);

  //add views
  ServerHelper.addViews(server);

  //Default Routes
  ServerHelper.setDefaultRoute(server);

  SSOManager.createRoute(server);

  // Add routes to Swagger documentation
  ServerHelper.addSwaggerRoutes(server);


  // Bootstrap Application
  ServerHelper.bootstrap();

  // SocketManager.connectSocket(server);

  ServerHelper.attachLoggerOnEvents(server);

  // Start Server
  await ServerHelper.startServer(server);
};

/**
 * @author Sanchit Dang
 * @description Start HAPI Server
 */
export const startMyServer = async () => {
  ServerHelper.configureLog4js();

  ServerHelper.connectMongoDB();

  // Redis Connection
  // ServerHelper.connectRedisDB();

  // Kafka Connection 
  //await ServerHelper.connectKafka();

  // Global variable to get app root folder path
  ServerHelper.setGlobalAppRoot();


  process.on("unhandledRejection", (err) => {
    appLogger.fatal(err);
    process.exit(1);
  });

  await initServer();
};
