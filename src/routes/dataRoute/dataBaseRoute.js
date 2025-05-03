import Controller from "../../controllers";
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Config from "../../config";

const createDataEntry = {
  method: "POST",
  path: "/api/data/createDataEntry",

  options: {
    description: "create Data Entry",
    tags: ["api", "create", "DataEntry"],
    handler: function (request, reply) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      const payload = request.payload;
      return new Promise((resolve, reject) => {
        Controller.DataBaseController.createDataRecord(
          { data: payload, userData },
          function (err, data) {
            if (err) {
              reject(UniversalFunctions.sendError(err));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  data
                )
              );
            }
          }
        );
      });
    },
    auth: "UserAuth",
    validate: {
      payload: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        dataURL: Joi.string().required(),
      }).label("Upload name description dataURL"),
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};
const getDataEntries = {
  method: "GET",
  path: "/api/data/getDataEntries",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.DataBaseController.getDataEntries(
        userData,
        function (err, data) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        }
      );
    });
  },
  config: {
    description: "get DataEntries",
    tags: ["api", "data", "DataEntries"],
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};
const deleteData = {
  method: "DELETE",
  path: "/api/data/deleteDataEntry/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const payloadData = request.params;
    return new Promise((resolve, reject) => {
      Controller.DataBaseController.deleteData(
        userData,
        payloadData,
        function (err, data) {
          if (err) reject(UniversalFunctions.sendError(err));
          else
            resolve(
              UniversalFunctions.sendSuccess(
                Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
                data
              )
            );
        }
      );
    });
  },
  config: {
    description: "delete data",
    tags: ["api", "user", "data"],
    auth: "UserAuth",
    validate: {
      params: {
        _id: Joi.string().required(),
      },
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{ user: {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};
export default [
  // createDataEntry, getDataEntries, deleteData
];
