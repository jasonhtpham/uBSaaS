import async from "async";
import Service from "../../services";
import { messaging } from "../../firebase";



const updateJob = (payload, callback) => {
  // console.log("payload data---", payload);
  var insightURL = payload.insightFileURL;
  var jobID = payload.jobid;
  var returnData = payload.returnData;
  var duration = payload.duration ?? "0";
  var response, jobStatus;
  let firebaseMessagingToken;
  async.series(
    [
      (cb) => {
        let criteria = {
          _id: jobID,
        };
        let success = {
          $set: {
            executionTime: duration,
            insightsURL: insightURL.json,
            jobStatus: "SUCCESS",
            returnData: returnData,
          },
        };
        let failed = {
          $set: {
            executionTime: duration,
            insightsURL: "NO INSIGHTS",
            jobStatus: "FAILED",
            returnData: returnData,
          },
        };
        let running = {
          $set: {
            executionTime: "Calculating",
            insightsURL: "Generating Insights",
            jobStatus: "RUNNING",
            returnData: returnData,
          },
        };
        if (insightURL === "running") {
          jobStatus = running;
        } else if (insightURL === "N/A") {
          jobStatus = failed;
        } else {
          jobStatus = success;
        }
        Service.JobService.updateRecord(
          criteria,
          jobStatus,
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              console.log("Updated Record with ", data);
              firebaseMessagingToken = data.firebaseMessagingToken;
              response = {
                insightsURL: insightURL,
                jobID: jobID,
                returnData: returnData,
              };
              cb();
            }
          }
        );
      },
      (cb) => {
        console.log("===== Sending message =====");

        const message = {
          notification: {
            title: `JOB ${jobStatus.$set.jobStatus}`,
            body: `The job ${jobID} is ${jobStatus.$set.jobStatus} at operation`,
          },
          data: {
            "status": jobStatus.$set.jobStatus,
            "returnData": JSON.stringify(jobStatus.$set.returnData)
          },
          token: firebaseMessagingToken
        };
        console.log("Message object: ", message);
        messaging
          .send(message)
          .then(function (response) {
            console.log("Successfully sent message:", response);
          })
          .catch(function (error) {
            console.log("Error sending message:", error);
          });
        console.log("!!!!! Message sent !!!!!");

        cb();
      }
    ],
    (err, result) => {
      if (err) callback(err);
      else callback(null, response);
    }
  );
};

export default {
  updateJob: updateJob,
};
