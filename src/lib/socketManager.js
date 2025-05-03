"use strict";
/**
 * Created by Navit.
 */

/**
 * Please use socketLogger for logging in this file try to abstain from console
 * levels of logging:
 * - TRACE - ‘blue’
 * - DEBUG - ‘cyan’
 * - INFO - ‘green’
 * - WARN - ‘yellow’
 * - ERROR - ‘red’
 * - FATAL - ‘magenta’
 */
/**
 * Created by Navit.
 */
import Config from "../config";
import SocketIO from "socket.io";
import TokenManager from "./tokenManager";
import async from "async";
import Service from "../services";

const ERROR = Config.APP_CONSTANTS.STATUS_MSG;

var io;

function connectSocket(server) {
  io = SocketIO({ cors: true }).listen(server.listener);

  console.log("socket server started");

  io.on("connection", function (socket) {
    socketLogger.info("connection established: ", socket.id);
    socket.emit("message", {
      message: {
        type: "connection",
        statusCode: 200,
        statusMessage: "WELCOME TO DATA SHOP",
        data: "",
      },
    });
    socket.on("Ping", function (data) {
      io.in(socket.id).emit("message", {
        message: {
          type: "ping",
          statusCode: 200,
          statusMessage: "Pong",
          data: "",
        },
      });
    });
    socket.on("authenticate", function (userToken) {
      console.log(">>>>>>> authenticate request for user");
      authenticateUser(userToken, socket, function (err, data) {
        if (err)
          return io.in(socket.id).emit("message", {
            message: {
              type: "INCORRECT_ACCESSTOKEN",
              statusCode: 403,
              statusMessage: "Incorrect AccessToken",
              data: {},
            },
          });
        io.in(socket.id).emit("message", {
          message: {
            type: "authenticate",
            statusCode: 200,
            statusMessage: "Success",
            data: data,
          },
        });
      });
    });
  });

  process.on("notification", function (data) {
    console.log("========= Notification: ", data);
    io.in(data.socketId).emit("notification", {
      message: data.message,
      success: data.success,
    });
  });

  async function authenticate(auth_token, callback) {
    console.log("authenticate");
    const data = await TokenManager.verifyToken(auth_token);
    if (!data.userData) return callback(ERROR.ERROR.INCORRECT_ACCESSTOKEN);
    callback(null, data);
  }

  async function authenticateUser(userToken, socket, callback) {
    console.log("authenticateUser");
    var userData;
    async.series(
      [
        function (cb) {
          authenticate(userToken, function (err, data) {
            if (err) cb(err);
            else {
              userData = data.userData;
              console.log("userData", userData);
              cb();
            }
          });
        },
        // function (cb) {
        //   Service.RedisService.createRecord(
        //     userData.userId.toString(),
        //     socket.id,
        //     (err, data) => {
        //       if (err) cb(err);
        //       else cb();
        //     }
        //   );
        // },
      ],
      function (err, result) {
        if (err) callback(err);
        else callback(null, { redisData: result });
      }
    );
  }
}

export default {
  connectSocket,
};
