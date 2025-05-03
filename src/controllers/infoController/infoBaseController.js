import Service from "../../services";
import async from "async";
import UniversalFunctions from "../../utils/universalFunctions";

const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
const _ = require("underscore");

const getInformation = (userData, callback) => {
  let infoObj = {};
  async.series([function (cb) {
    Service.ServiceService.getRecordsCount({}, {}, {}, function (err, data) {
      if (err) {
        cb(err);
      } else {
        infoObj.serviceCount = data;
        cb();
      }
    });
  }, function (cb) {
    Service.ServiceService.getRecord({}, {}, {}, function (err, data) {
      if (err) {
        cb(err);
      } else {
        infoObj.services = data;
        cb();
      }
    });
  }, function (cb) {
    Service.JobService.getRecordsCount({jobCreator: userData.userId}, {}, {}, function (err, data) {
      if (err) {
        cb(err);
      } else {
        infoObj.jobCount = data;
        cb();
      }
    });
  }, function (cb) {
    Service.JobService.getRecord({jobCreator: userData.userId}, {}, {}, function (err, data) {
      if (err) {
        cb(err);
      } else {
        infoObj.jobs = data;
        cb();
      }
    });
  }, function (cb) {
    //TODO: Remember to merge this criteria with User/Developer Role Field
    //TODO: aggregate also support $filter (aggregation) -- https://www.mongodb.com/docs/manual/reference/operator/aggregation/filter/
    Service.UserProfileService.aggregate([{$sample: {size: 12}}], function (err, data) {
      if (err) {
        cb(err);
      } else {
        infoObj.developers = data;
        cb();
      }
    });
  },], function (err, result) {
    if (err) callback(err); else callback(null, infoObj);
  });
};

export default {
  getInformation: getInformation,
};
