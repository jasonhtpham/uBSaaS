import Controller from "../../controllers";
import UniversalFunctions from "../../utils/universalFunctions";
import Joi from "joi";
import Config from "../../config";

const createJob = {
  method: "POST",
  path: "/api/job/createJob",
  options: {
    description: "create job",
    tags: ["api", "create", "job"],
    auth: {
      strategies: ['UserAuth', 'M2MAuth'],
      mode: 'required'
    },
    handler: function (request, reply) {
      const userData =
        (request.auth &&
          request.auth.credentials &&
          request.auth.credentials.userData) ||
        null;
      const payload = request.payload;
      return new Promise((resolve, reject) => {
        Controller.JobBaseController.createJob(
          userData,
          payload,
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
        jobName: Joi.string().required(),
        serviceID: Joi.string().required(),
        firebaseMessagingToken: Joi.string().optional().default(""),
        datafileURL: Joi.object({
          url: Joi.any(),
          json: Joi.any(),
        }).label("datafileURL"),
      }).label("Upload Document URL"),
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

const getJobs = {
  method: "GET",
  path: "/api/job/getJobs",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    return new Promise((resolve, reject) => {
      Controller.JobBaseController.getJobs(userData, function (err, data) {
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
    description: "get Jobs",
    tags: ["api", "user", "getJobs"],
    auth: {
      strategies: ['UserAuth', 'M2MAuth'],
      mode: 'required'
    },
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

const getJob = {
  method: "GET",
  path: "/api/job/getJob/{jobId}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const jobId = request.params.jobId;
    return new Promise((resolve, reject) => {
      Controller.JobBaseController.getJob(userData, jobId, function (err, data) {
        if (err) reject(UniversalFunctions.sendError(err));
        else
          resolve(
            UniversalFunctions.sendSuccess(
              Config.APP_CONSTANTS.STATUS_MSG.SUCCESS.DEFAULT,
              data.data
            )
          );
      });
    });
  },
  config: {
    description: "get Jobs",
    tags: ["api", "user", "getJobs"],
    auth: {
      strategies: ['UserAuth', 'M2MAuth'],
      mode: 'required'
    },
    validate: {
      params: {
        jobId: Joi.string().required()
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

const deleteJob = {
  method: "DELETE",
  path: "/api/job/deleteJob/{_id}",
  handler: function (request, h) {
    const userData =
      (request.auth &&
        request.auth.credentials &&
        request.auth.credentials.userData) ||
      null;
    const payloadData = request.params;
    return new Promise((resolve, reject) => {
      Controller.JobBaseController.deleteJob(
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
    description: "delete job",
    tags: ["api", "user", "job"],
    auth: {
      strategies: ['UserAuth', 'M2MAuth'],
      mode: 'required'
    },
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

export default [createJob, getJobs, getJob, deleteJob];
