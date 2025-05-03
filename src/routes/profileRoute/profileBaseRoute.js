import Controller from "../../controllers";
import UniversalFunctions from "../../utils/universalFunctions";

const getProfile = {
  method: "GET", path: "/api/profile/{userId}", options: {
    description: "get profile of user", tags: ["api", "user"], handler: function (request, h) {
      let payload = {userId: request.params.userId}
      return new Promise((resolve, reject) => {
        if (payload && payload.userId) {
          Controller.UserProfileController.getPublicProfile(payload, function (error, success) {
            if (error) {
              reject(UniversalFunctions.sendError(error));
            } else {
              resolve(UniversalFunctions.sendSuccess(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT, success));
            }
          });
        } else {
          reject(UniversalFunctions.sendError(UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR.INVALID_TOKEN));
        }
      });
    }, validate: {
      failAction: UniversalFunctions.failActionFunction
    }, plugins: {
      "hapi-swagger": {
        security: [{'user': {}}],
        responseMessages: UniversalFunctions.CONFIG.APP_CONSTANTS.swaggerDefaultResponseMessages
      }
    }
  }
};

export default [getProfile];
