import UniversalFunctions from "../../utils/universalFunctions";
import async from "async";
import Service from "../../services";
import CONFIG from "../../config";
import AWS from "aws-sdk";
import Controller from "../index";
import Config from "../../config";
const createDataRecord = (payload, callback) => {
  const userData = payload.userData;
  let payloadData = payload.data;
  let dataDetails = {};
  let name, description, dataURL, customerData, creatorID;

  async.series(
    [
      //verify user authentication
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
      //create the record
      (cb) => {
        const dataDetails = {
          creatorID: customerData._id,
          name: payloadData.name,
          description: payloadData.description,
          dataURL: payloadData.dataURL,
        };
        Service.DataService.createRecord(dataDetails, (err, result) => {
          if (err) {
            console.log(err);
            cb(err);
          } else {
            console.log("created record");
            cb();
          }
        });
      },
    ],
    (err, result) => {
      if (err) callback(err);
      else callback();
    }
  );
};
const getDataEntries = (userData, callback) => {
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
        console.log(userFound._id);
        criteria = {
          creatorID: userFound._id,
        };
        projection = {};
        Service.DataService.getRecord(
          criteria,
          projection,
          {},

          function (err, data) {
            console.log(`Datasets available---->`, { data });
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

const deleteData = (userData, payloadData, callback) => {
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
        Service.DataService.deleteRecord(
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
  createDataRecord: createDataRecord,
  getDataEntries: getDataEntries,
  deleteData: deleteData,
};
