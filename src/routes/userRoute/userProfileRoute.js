import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Controller from "../../controllers";

const getDeveloperProfile = {
  method: "GET",
  path: "/api/user/developerProfiles",
  options: {
    description: "get profile of developer",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          Controller.UserProfileController.getDeveloperProfile(userData, function (
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          });
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{'user': {}}],
        responseMessages:
        UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
const editDeveloperProfile = {
  method: "PUT",
  path: "/api/user/profile",
  options: {
    description: "edit user profile",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      const payload = request.payload
      return new Promise((resolve, reject) => {
        Controller.UserProfileController.editDeveloperProfile(userData, payload, function (
          error,
          success
        ) {
          if (error) {
            reject(UniversalFunctions.sendError(error));
          } else {
            resolve(
              UniversalFunctions.sendSuccess(
                UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                  .DEFAULT,
                success
              )
            );
          }
        });
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction,
      payload: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        description: Joi.string().optional().allow(""),
        picture: Joi.string().optional().allow(""),
        researchInterests: Joi.string().optional().allow(""),
        organization: Joi.string().optional().allow(""),
      }).required().label('User Profile')
    },
    plugins: {
      "hapi-swagger": {
        security: [{'user': {}}],
        responseMessages:
        UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};
const getUserProfile = {
  method: "GET",
  path: "/api/user/getUserProfile",
  options: {
    description: "get profile of user",
    auth: {
      strategies: ['UserAuth', 'M2MAuth'],
      mode: 'required'
    },
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          Controller.UserProfileController.getUserProfile(userData, function (
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          });
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{'user': {}}],
        responseMessages:
        UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const getSignedLogicSig = {
  method: "GET",
  path: "/api/user/getSignedLogicSig",
  options: {
    description: "Get the user's signed logic signature. Returns an empty array if the user has not provided one.",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          Controller.UserProfileController.getSignedLogicSig(userData, function (
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                  UniversalFunctions.sendSuccess(
                    UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                      .DEFAULT,
                    success
                  )
              );
            }
          });
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{'user': {}}],
        responseMessages:
        UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

const setSignedLogicSig = {
  method: "PUT",
  path: "/api/user/setSignedLogicSig",
  options: {
    description: "Set a signed logic sig for a user",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      const payload = request.payload;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          Controller.UserProfileController.setSignedLogicSig(userData, payload, function (
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                  UniversalFunctions.sendSuccess(
                    UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                      .DEFAULT,
                    success
                  )
              );
            }
          });
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{'user': {}}],
        responseMessages:
        UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

/***
 * Convert user role to developer role
 * @type {{path: string, method: string, options: {handler: (function(*, *): Promise<unknown>), auth: string, plugins: {"hapi-swagger": {security: [{user: {}}], responseMessages: [{code: number, message: string},{code: number, message: string},{code: number, message: string},{code: number, message: string},{code: number, message: string}]}}, description: string, tags: string[], validate: {failAction: ((function(*, *, *): *)|*)}}}}
 */
const convertUserToDeveloper = {
  method: "GET",
  path: "/api/user/convertUserToDeveloper",
  options: {
    description: "change user role to developer",
    auth: "UserAuth",
    tags: ["api", "user"],
    handler: function (request, h) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      return new Promise((resolve, reject) => {
        if (userData && userData._id) {
          Controller.UserProfileController.convertUserToDeveloper(userData, function (
            error,
            success
          ) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(
                UniversalFunctions.sendSuccess(
                  UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS
                    .DEFAULT,
                  success
                )
              );
            }
          });
        } else {
          reject(
            UniversalFunctions.sendError(
              UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR
                .INVALID_TOKEN
            )
          );
        }
      });
    },
    validate: {
      failAction: UniversalFunctions.failActionFunction
    },
    plugins: {
      "hapi-swagger": {
        security: [{'user': {}}],
        responseMessages:
        UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

export default [
  getDeveloperProfile,
  editDeveloperProfile,
  getUserProfile,
  convertUserToDeveloper,
  getSignedLogicSig,
  setSignedLogicSig
];
