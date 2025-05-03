import Service from "../../services";
import async from "async";
import UniversalFunctions from "../../utils/universalFunctions";
import Controller from "../index";

const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;


/**
 * @param {Object} payload
 * @param {String} payload.userId
 * @param {Function} callback
 */
const getDeveloperProfile = (payload, callback) => {
  const userId = payload.userId;
  let developerProfiles = [];
  const tasks = {
    getBasicInfo: (cb) => {
      const criteria = { _id: userId };
      const projection = {};
      Service.UserService.getRecord(criteria, projection, {}, (err, data) => {
        if (err) return cb(err);
        if (data.length === 0) return cb(ERROR.USER_NOT_FOUND);
        cb();
      })
    },
    getProfiles: (cb) => {
      const populate = {
        path: "services",
        select: {
          _id: 0,
          name: 1,
        },
      };
      Service.UserProfileService.getPopulatedRecords({}, {}, populate, (err, data) => {
        if (err) return cb(err);
        if (data.length === 0) return cb(ERROR.USER_NOT_FOUND);
        const result = data.filter((item) => {
          return item.services.length > 0;
        })
        developerProfiles = result || [];
        cb();
      });
    },
  }
  async.series(tasks, (err) => {
    if (err) return callback(err);
    callback(null, { data: developerProfiles });
  })
}
/**
 *
 * @param {Object} payload Payload
 * @param {Object} userData UserData
 * @param {Function} callback Callback Function
 */
const editDeveloperProfile = (userData, payload, callback) => {
  let customerData, developerData, response;
  let dataToUpdate;
  async.series(
    [
      //verify user authentication
      function (cb) {
        var query = {
          _id: userData.userId
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
      //update the record
      function (cb) {
        var criteria = {
          userId: userData.userId,
        };
        dataToUpdate = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          description: payload.description,
          picture: payload.picture,
          researchInterests: payload.researchInterests,
          organization: payload.organization
        }
        Service.UserProfileService.updateRecord(criteria, dataToUpdate, {}, function (err, data) {
          if (err) cb(err)
          else {
            response = {
              userID: userData.userId,
              firstName: data.firstName,
              lastName: data.lastName,
              description: data.description,
              picture: data.picture,
              researchInterests: data.researchInterests,
              organization: data.organization
            }
          }
          cb()
        })
      }
    ],
    (err, result) => {
      if (err) callback(err);
      else callback(null, { response });
    }
  );
};

/**
 * @param {Object} payload
 * @param {String} payload.userId
 * @param {Function} callback
 */
const getUserProfile = (payload, callback) => {
  let customerData, customerProfile;
  async.series(
    [
      //verify user authentication
      function (cb) {
        var query = {
          _id: payload.userId
        };
        var populate = {
          path: 'services',
        };
        Service.UserService.getPopulatedRecords(query, {}, populate, function (err, data) {
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
      //get the user profile record
      function (cb) {
        var query = {
          userId: payload.userId
        };
        var options = { lean: true };
        Service.UserProfileService.getRecord(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) {
              // create empty profile
              Service.UserProfileService.createRecord({
                userId: customerData._id,
                firstName: customerData.firstName,
                lastName: customerData.lastName
              }, (err, res) => {
                if (err) return cb(err);
                customerProfile = res
                cb();
              });
            } else {
              customerProfile = (data && data[0]) || null;
              cb();
            }
          }
        });
      },], (err, result) => {
        const apiKeys = customerData.services;
        if (err) callback(err); else callback(null, { customerProfile, apiKeys });
      });
};

const getSignedLogicSig = (payload, callback) => {
  let customerData, customerProfile;
  async.series(
    [
      //verify user authentication
      function (cb) {
        var query = {
          _id: payload.userId
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
      //get the user profile record
      function (cb) {
        var query = {
          userId: payload.userId
        };
        var options = { lean: true };
        Service.UserProfileService.getRecord(query, {}, options, function (err, data) {
          if (err) {
            cb(err);
          } else {
            if (data.length == 0) {
              // create empty profile
              Service.UserProfileService.createRecord({
                userId: customerData._id,
                firstName: customerData.firstName,
                lastName: customerData.lastName
              }, (err, res) => {
                if (err) return cb(err);
                customerProfile = res
                cb();
              });
            } else {
              customerProfile = (data && data[0]) || null;
              cb();
            }
          }
        });
      },], (err, result) => {
        if (err) {
          callback(err)
        } else {
          callback(null, { "signedLogicSig": customerProfile.signedLogicSig });
        };
      }
  );
};

/**
 *
 * @param {Object} payload Payload
 * @param {Object} userData UserData
 * @param {Function} callback Callback Function
 */
const setSignedLogicSig = (userData, payload, callback) => {
  let customerData, response;
  let dataToUpdate;
  async.series(
    [
      //verify user authentication
      function (cb) {
        var query = {
          _id: userData.userId
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
      //update the record
      function (cb) {
        var criteria = {
          userId: userData.userId,
        };
        dataToUpdate = {
          signedLogicSig: payload.signedLogicSig
        }
        Service.UserProfileService.updateRecord(criteria, dataToUpdate, {}, function (err, data) {
          if (err) cb(err)
          else {
            response = {
              userID: userData.userId,
              signedLogicSig: data.signedLogicSig
            }
          }
          cb()
        })
      }
    ],
    (err, result) => {
      if (err) callback(err);
      else callback(null, response);
    }
  );
};

const getPublicProfile = (payload, callback) => {
  let customerProfile = {};
  async.series([//get the user profile record
    function (cb) {
      Service.UserProfileService.getRecord({ userId: payload.userId }, {}, {}, function (err, data) {
        if (err) {
          cb(err);
        } else {
          if (data[0] != null) {
            customerProfile.userId = data[0].userId;
            customerProfile.firstName = data[0].firstName;
            customerProfile.lastName = data[0].lastName;
            customerProfile.description = data[0].description;
            customerProfile.picture = data[0].picture;
            customerProfile.researchInterests = data[0].researchInterests;
            customerProfile.organization = data[0].organization;
            customerProfile.createdAt = data[0].createdAt;
            customerProfile.updatedAt = data[0].updatedAt;
            Controller.ServiceController.getServicesByUserID(payload.userId, function (error, servicesData) {
              if (error) {
                customerProfile.serviceData = null;
                cb();
              } else {
                customerProfile.serviceData = servicesData;
                cb();
              }
            });
          } else {
            cb();
          }
        }
      });
    },], (err, result) => {
      if (err) callback(err); else callback(null, { customerProfile });
    });
};


export default {
  getDeveloperProfile, editDeveloperProfile, getUserProfile, getPublicProfile, getSignedLogicSig, setSignedLogicSig
};
