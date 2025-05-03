import async from "async";
import Service from "../../services";
import axios from "axios";
import UniversalFunctions from "../../utils/universalFunctions";
import { messaging } from "../../firebase";

const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;

if (!process.env.REDIS_URL) {
  throw new Error("Please provide the REDIS_URL env variable");
}

function handleAsyncRequest(jobid, payloadData, firebaseMessagingToken, serviceEndpoint) {
  let datashopServerAddr = process.env.BASE_URL;
  let lambdaInput = {
    jobID: jobid,
    datashopServerAddress: datashopServerAddr,
    dataFileURL: {
      url: payloadData.url,
      blob: payloadData.blob,
      json: payloadData.json,
    },
  };

  async.series([
    async (cb) => {
      axios.post(serviceEndpoint, lambdaInput)
        .then(() => {
          let criteria = { _id: jobid };
          let exectime = { $set: { executionTime: 0 } };

          Service.JobService.updateRecord(criteria, exectime, {}, function (err, data) {
            if (err) console.error(err);
            else console.log("Updated Record with ", data);
          });
          cb();
        })
        .catch(async (error) => {
          console.error("Service Start ERROR:", error.message);
          let criteria = { _id: jobid };
          let failed = {
            $set: {
              executionTime: "0",
              insightsURL: "NO INSIGHTS",
              jobStatus: "FAILED",
            },
          };

          Service.JobService.updateRecord(criteria, failed, {}, function (err, data) {
            if (err) console.error(err);
            else console.log("Updated Record with ", data);
          });
          const message = {
            notification: {
              title: "JOB FAILED AT INITIALIZATION",
              body: `The job ${jobid} was unsuccessfully initialized`,
            },
            token: firebaseMessagingToken
          };
          messaging
            .send(message)
            .then(function (response) {
              console.log("Successfully sent message:", response);
            })
            .catch(function (error) {
              console.log("Error sending message:", error);
            });

          cb(error);
        });
    }
  ],
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Job initialization successful");
      }
    }
  )
}

const createJob = (userData, payload, callback) => {
  let data = payload.datafileURL;
  let dataToSave = {};
  let serviceEndpoint;
  let customerData, jobid;
  async.series(
    [
      function (cb) {
        var query = {
          _id: userData.userId,
        };

        var options = { lean: true };
        Service.UserService.getRecord(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              customerData = (data && data[0]) || null;
              if (customerData.isBlocked) cb(ERROR.ACCOUNT_BLOCKED);
              else cb();
            }
          }
        });
      },
      (cb) => {
        let criteria = {
          _id: payload.serviceID,
        };
        let projection = {};
        Service.ServiceService.getRecord(
          criteria,
          projection,
          {},
          function (err, result) {
            if (err) {
              cb(err);
            } else {
              const urlAddress = JSON.parse(JSON.stringify(result[0].url));
              const endpoint = JSON.parse(JSON.stringify(result[0].endpoint));
              serviceEndpoint = urlAddress + endpoint;
              cb();
            }
          }
        );
      },
      (cb) => {
        dataToSave = {
          jobName: payload.jobName,
          serviceID: payload.serviceID,
          jobCreator: customerData._id,
          firebaseMessagingToken: payload.firebaseMessagingToken,
          jobStatus: "INITIATED",
          createdAt: Date.now(),
          dataURL: data.json,
          executionTime: "0",
          insightsURL: "NO URL GENERATED YET",
          returnData: "EMPTY",
        };
        Service.JobService.createRecord(dataToSave, (err, result) => {
          if (err) {
            cb(err);
          } else {
            jobid = result._id;
            // console.log("Record initiated as ", result, userData);
            cb(null, { jobID: jobid });
          }
        });
      },
      (cb) => {
        handleAsyncRequest(jobid, data, payload.firebaseMessagingToken, serviceEndpoint);
        cb();
      },
    ],
    (err, result) => {
      if (err) callback(err);
      else callback(null, result[2].jobID);
    }
  );
};

const getJobs = (userData, callback) => {
  let userFound;
  let criteria, projection;
  let cardList = [];
  async.series(
    [
      function (cb) {
        const criteria = {
          _id: userData.userId,
        };
        Service.UserService.getRecord(
          criteria,
          { password: 0 },
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
              else {
                userFound = (data && data[0]) || null;
                if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
                else cb();
              }
            }
          }
        );
      },
      function (cb) {
        criteria = {
          jobCreator: userFound._id,
        };
        projection = {};
        Service.JobService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            // console.log(`Jobs data---->`, { data });
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
                // return UniversalFunctions.processUserData(element);
                return element;
              });
              cb();
            }
          }
        );
      },
    ],
    function (err, result) {
      if (err) callback(err);
      else callback(null, { data: cardList });
    }
  );
};

const getJob = (userData, jobId, callback) => {
  let userFound;
  let criteria, projection;
  let job;
  async.series(
    [
      function (cb) {
        const criteria = {
          _id: userData.userId,
        };
        Service.UserService.getRecord(
          criteria,
          { password: 0 },
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
              else {
                userFound = (data && data[0]) || null;
                if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
                else cb();
              }
            }
          }
        );
      },
      function (cb) {
        criteria = {
          _id: jobId,
          jobCreator: userFound._id,
        };
        projection = {};
        Service.JobService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            // console.log(`Job data---->`, data);
            if (err) cb(err);
            else {
              if (data.length == 0) {
                cb(new Error("Job with Job ID: " + jobId + " does not exist"));
              } else {
                job = data[0];
                cb();
              }
            }
          }
        );
      },
    ],
    function (err, result) {
      if (err) callback(err);
      else callback(null, { data: job });
    }
  );
};

const deleteJob = (userData, payloadData, callback) => {
  let news;
  let userFound;
  async.series(
    [
      function (cb) {
        var criteria = {
          _id: userData.userId,
        };
        Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
          if (err) cb(err);
          else {
            if (data.length == 0) cb(ERROR.INCORRECT_ACCESSTOKEN);
            else {
              userFound = (data && data[0]) || null;
              if (userFound.isBlocked == true) cb(ERROR.ACCOUNT_BLOCKED);
              else cb();
            }
          }
        });
      },
      function (cb) {
        Service.JobService.deleteRecord(
          { _id: payloadData._id },
          function (err, data) {
            if (err) cb(err);
            else cb();
          }
        );
      },
    ],
    function (err, result) {
      if (err) return callback(err);
      else return callback(null, { data: news });
    }
  );
};
export default {
  createJob: createJob,
  getJobs: getJobs,
  getJob: getJob,
  deleteJob: deleteJob,
};
