import UniversalFunctions from "../../utils/universalFunctions";
import Controller from "../../controllers";
import Joi from "joi";
import Config from "../../config";

const createJob = {
  method: "POST",
  path: "/api/gateway/createJob",
  options: {
    description: "List services created under requested account",
    tags: ["api", "gateway"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
        deviceData: Joi.object({
          deviceType: Joi.string().valid(...Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES)).required(),
          deviceName: Joi.string().required(),
          deviceUUID: Joi.string().guid().required(),
        }).label('deviceData')
      }).label("User: Login"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const listJob = {
  method: "POST",
  path: "/api/gateway/listJob",
  options: {
    description: "List jobs created under requested account",
    tags: ["api", "gateway"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
        deviceData: Joi.object({
          deviceType: Joi.string().valid(...Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES)).required(),
          deviceName: Joi.string().required(),
          deviceUUID: Joi.string().guid().required(),
        }).label('deviceData')
      }).label("User: Login"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const deleteJob = {
  method: "POST",
  path: "/api/gateway/deleteJob",
  options: {
    description: "List services created under requested account",
    tags: ["api", "user"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
        deviceData: Joi.object({
          deviceType: Joi.string().valid(...Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES)).required(),
          deviceName: Joi.string().required(),
          deviceUUID: Joi.string().guid().required(),
        }).label('deviceData')
      }).label("User: Login"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const checkJobStatus = {
  method: "POST",
  path: "/api/gateway/checkJobStatus",
  options: {
    description: "List services created under requested account",
    tags: ["api", "user"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
        deviceData: Joi.object({
          deviceType: Joi.string().valid(...Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES)).required(),
          deviceName: Joi.string().required(),
          deviceUUID: Joi.string().guid().required(),
        }).label('deviceData')
      }).label("User: Login"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const createService = {
  method: "POST",
  path: "/api/gateway/createService",
  options: {
    description: "List services created under requested account",
    tags: ["api", "user"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
        deviceData: Joi.object({
          deviceType: Joi.string().valid(...Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES)).required(),
          deviceName: Joi.string().required(),
          deviceUUID: Joi.string().guid().required(),
        }).label('deviceData')
      }).label("User: Login"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const listService = {
  method: "POST",
  path: "/api/gateway/listService",
  options: {
    description: "List services created under requested account",
    tags: ["api", "user"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
        deviceData: Joi.object({
          deviceType: Joi.string().valid(...Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES)).required(),
          deviceName: Joi.string().required(),
          deviceUUID: Joi.string().guid().required(),
        }).label('deviceData')
      }).label("User: Login"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const deleteService = {
  method: "POST",
  path: "/api/gateway/deleteService",
  options: {
    description: "List services created under requested account",
    tags: ["api", "user"],
    handler: (request, h) => {
      const payloadData = request.payload;
      if (!UniversalFunctions.verifyEmailFormat(payloadData.emailId)) {
        reject(
          UniversalFunctions.sendError(
            UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
              .INVALID_EMAIL_FORMAT
          )
        );
      } else {
        return new Promise((resolve, reject) => {
          Controller.UserBaseController.loginUser(payloadData, (err, data) => {
            if (err) reject(UniversalFunctions.sendError(err));
            else resolve(UniversalFunctions.sendSuccess(null, data));
          });
        });
      }
    },
    validate: {
      payload: Joi.object({
        emailId: Joi.string().required(),
        password: Joi.string().required().min(5).trim(),
        deviceData: Joi.object({
          deviceType: Joi.string().valid(...Object.values(Config.APP_CONSTANTS.DATABASE.DEVICE_TYPES)).required(),
          deviceName: Joi.string().required(),
          deviceUUID: Joi.string().guid().required(),
        }).label('deviceData')
      }).label("User: Login"),
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

export default [
  // createJob, listJob, deleteJob, checkJobStatus, createService, listService, deleteService
];
