import Service from "../../services";
import async from "async";
import UniversalFunctions from "../../utils/universalFunctions";
import mongoose from "mongoose";

const ERROR = UniversalFunctions.CONFIG.APP_CONSTANTS.STATUS_MSG.ERROR;
const _ = require("underscore");

/**
 *
 * @param {Object} userData
 * @param {Object} payloadData
 * @param {url} payloadData.url  in url format
 * @param {Function} callback string
 * @param {name} payloadData.name string
 * @param {endpoint} payloadData.endpoint string
 * @param {cost} payloadData.cost string
 * @param {serviceId} payloadData.serviceId string
 */
const createService = (userData, payloadData, callback) => {
  let serviceData, serviceId;
  let userFound;

  const task = {
    validateUser: (cb) => {
      const criteria = {
        _id: userData.userId,
      };
      Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
        if (err) return cb(err);
        if (data.length == 0) return cb(ERROR.INCORRECT_ACCESSTOKEN);
        userFound = (data && data[0]) || null;
        cb();
      });
    },
    createServices: (cb) => {
      let serviceToSave = {
        serviceCreator: userFound._id,
        url: payloadData.url,
        endpoint: payloadData.endpoint,
        name: payloadData.name,
        requirements: payloadData.requirements,
        description: payloadData.description,
        cost: payloadData.cost,
        creator_id: userData.userId,
        requires_asset_opt_in: payloadData.requiresAssetOptIn
      };
      Service.ServiceService.createRecord(serviceToSave, function (err, data) {
        if (err) return cb(err);
        if (data?.length === 0) return cb(ERROR.DEFAULT);
        serviceId = data._id;
        serviceData = data;
        return cb();
      });
    },
    updateUserProfile: (cb) => {
      const criteria = {
        userId: userFound._id,
      };
      const dataToUpdate = {
        $addToSet: {
          services: serviceId,
        },
      };
      Service.UserProfileService.updateRecord(
        criteria,
        dataToUpdate,
        {},
        function (err) {
          if (err) return cb(err);
          cb();
        }
      );
    },
  };
  async.series(task, function (err) {
    if (err) return callback(err);
    else return callback(null, { serviceData });
  });
};

const getService = (userData, callback) => {
  let cardList = [];
  let userFound;
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
        const criteria = {
          active: true
        };
        const projection = {};
        Service.ServiceService.getRecord(
          criteria,
          projection,
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
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

/**
 * @param {Object} userData
 * @param {url} payloadData.url  in url format
 * @param {Function} callback string
 * @param {name} payloadData.name string
 * @param {endpoint} payloadData.endpoint string
 * @param {requirements} payloadData.requirements string
 * @param {cost} payloadData.cost string
 * @param {serviceId} payloadData.serviceId string
 */
const getServiceCount = (userData, _id, callback) => {
  let cardList = [];
  let userFound;
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
        const criteria = {
          serviceID: _id,
        };
        const projection = {};
        Service.JobService.getRecordsCount(
          criteria,
          projection,
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              console.log(data);
              (cardList = data), cb();
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

const getServiceById = (userData, _id, callback) => {
  let cardList = [];
  let userFound;
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
        const criteria = { _id: _id };
        const projection = {};
        Service.ServiceService.getRecord(
          criteria,
          projection,
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
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

const getServicesByUserID = (userId, callback) => {
  let cardList = [];
  async.series(
    [
      function (cb) {
        const criteria = { creator_id: userId, active: true, };
        Service.ServiceService.getRecord(
          criteria,
          {},
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              cardList = data.map((element) => {
                return element;
              });
              console.log(cardList);
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

const deleteService = (userData, payloadData, callback) => {
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
        Service.ServiceService.deleteRecord(
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

/**
 * 
 * @param {Object} userData 
 * @param {Object} payloadData 
 * @param {String} payloadData.name
 * @param {String} payloadData.description
 * @param {Function} callback 
 */
const createServiceGroup = (userData, payloadData, callback) => {
  let serviceGroupData;
  let userFound;

  const task = {
    validateUser: (cb) => {
      const criteria = {
        _id: userData.userId,
      };
      Service.UserService.getRecord(criteria, {}, {}, function (err, data) {
        if (err) return cb(err);
        if (data.length == 0) return cb(ERROR.INCORRECT_ACCESSTOKEN);
        userFound = (data && data[0]) || null;
        cb();
      });
    },
    createServiceGroup: (cb) => {
      let serviceGroupToSave = {
        name: payloadData.name,
        creator: userFound._id,
        description: payloadData.description
      };
      Service.ServiceGroupService.createRecord(serviceGroupToSave, function (err, data) {
        if (err) return cb(err);
        if (data?.length === 0) return cb(ERROR.DEFAULT);
        serviceGroupData = data;
        return cb();
      });
    },
  };
  async.series(task, function (err) {
    if (err) return callback(err);
    else return callback(null, { serviceGroupData });
  });
};

const getServiceGroup = (userData, callback) => {
  let serviceGroupData;
  let userFound;
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
        const criteria = {
          creator: userFound._id
        };
        const projection = {};
        Service.ServiceGroupService.getRecord(
          criteria,
          projection,
          {},
          function (err, data) {
            if (err) cb(err);
            else {
              serviceGroupData = data
              cb();
            }
          }
        );
      },
    ],
    function (err, result) {
      if (err) callback(err);
      else callback(null, { data: serviceGroupData });
    }
  );
};

/**
 * 
 * @param {Object} userData 
 * @param {Object} payloadData 
 * @param {String} payloadData.groupId
 * @param {Function} callback 
 */
const getServicesInServiceGroup = (userData, payloadData, callback) => {
  let serviceGroupData;
  let userFound;
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
        const criteria = {
          _id: payloadData.groupId
        };
        const projection = {};
        const populate = {
          path: 'services',
          match: {
            active: true
          }
        };
        Service.ServiceGroupService.getPopulatedRecords(
          criteria,
          projection,
          populate,
          function (err, data) {
            if (err) cb(err);
            else {
              serviceGroupData = data
              cb();
            }
          }
        );
      },
    ],
    function (err, result) {
      if (err) callback(err);
      else callback(null, { data: serviceGroupData });
    }
  );
};

const addServiceToGroup = (userData, payloadData, callback) => {
  let serviceGroupData;
  const serviceIds = payloadData.services.map((id) => mongoose.Types.ObjectId(id));

  const task = {
    migrateService: (cb) => {
      const criteria = {
        _id: payloadData.id
      };
      const toUpdate = {
        $addToSet: {
          services: {
            $each: serviceIds
          }
        }
      };
      Service.ServiceGroupService.updateRecord(criteria, toUpdate, {}, function (err, data) {
        if (err) return cb(err);
        if (data?.length === 0) return cb(ERROR.DEFAULT);
        return cb();
      });
    },
  };
  async.series(task, function (err) {
    if (err) return callback(err);
    else return callback(null, { serviceGroupData });
  });
};

export default {
  createService: createService,
  getService: getService,
  getServiceCount: getServiceCount,
  getServiceById: getServiceById,
  deleteService: deleteService,
  getServicesByUserID: getServicesByUserID,
  createServiceGroup: createServiceGroup,
  getServiceGroup: getServiceGroup,
  getServicesInServiceGroup: getServicesInServiceGroup,
  addServiceToGroup: addServiceToGroup
};
