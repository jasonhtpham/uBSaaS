import UniversalFunctions from "../../utils/universalFunctions";
import Controller from "../../controllers";

const Config = UniversalFunctions.CONFIG;

const getInfo = {
  method: "GET",
  path: "/api/info/getInfo",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.InfoBaseController.getInformation(userData, function (err, data) {
        if (err) reject(UniversalFunctions.sendError(err));
        else
          resolve(
            UniversalFunctions.sendSuccess(
              Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
              data
            )
          );
      });
    });
  },
  config: {
    description: "get information for dashboard",
    tags: ["api", "info", "getInfo"],
    auth: "UserAuth",
    validate: {
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        security: [{user: {}}],
        responseMessages:
        UniversalFunctions.CONFIG.APP_CONSTANTS
          .swaggerDefaultResponseMessages,
      },
    },
  },
};

export default [
  getInfo,
];
