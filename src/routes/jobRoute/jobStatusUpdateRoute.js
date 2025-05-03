import Controller from "../../controllers";
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";

const updateJob = {
  method: "PUT",
  path: "/api/job/updateJob",
  options: {
    description: "update job",
    tags: ["api", "update", "job"],
    handler: function (request, reply) {
      return new Promise((resolve, reject) => {
        Controller.JobUpdateController.updateJob(
          request.payload,
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
    validate: {
      payload: Joi.object({
        insightFileURL: Joi.any().required(),
        jobid: Joi.string().required(),
        returnData: Joi.any(),
        duration: Joi.string(),
      }).label("Updating results"),
      failAction: UniversalFunctions.failActionFunction,
    },
    plugins: {
      "hapi-swagger": {
        // security: [{ 'user': {} }],
        responseMessages:
          UniversalFunctions.CONFIG.APP_CONSTANTS
            .swaggerDefaultResponseMessages,
      },
    },
  },
};

export default [updateJob];
