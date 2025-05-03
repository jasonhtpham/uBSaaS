import Service from '../services';
import { boomify } from '@hapi/boom';
import crypto from 'crypto';


const validateFunc = async function (request, apiKey, h) {
  // Get the signature from the request headers
  const signature = request.headers['x-signature'];

  if (!signature) {
    throw boomify(new Error('Missing signature'), { statusCode: 401 });
  }

  var criteria = {
    apiKey: apiKey
  };

  var populate = [
    { path: 'user' }
  ];

  let result;

  try {
    result = await getPopulatedRecordsAsync(criteria, {}, populate);
  } catch (err) {
    throw boomify(new Error('Invalid API key or associated user not found'), { statusCode: 401 });
  }

  if (result.user.status == 'INACTIVE') {
    throw boomify(new Error('User is not active'), { statusCode: 401 });
  } else if (result.user.status == 'BLOCKED') {
    throw boomify(new Error('User is blocked'), { statusCode: 401 });
  } else if (result.user.services.includes(result._id) == false) {
    throw boomify(new Error('User is not subscribed to this service'), { statusCode: 401 });
  } else {
    // Construct the message from the request
    const message = result.name;
  
    // Get the secret key associated with the API key
    const secretKey = result.user.secretKey;

    // Generate the HMAC signature for the message using the secret key and api key
    const hmac = crypto.createHmac('sha256', secretKey);
    hmac.update(apiKey);
    hmac.update(message);
    const expectedSignature = hmac.digest('hex');
  
    // Compare the expected signature with the actual signature
    if (signature !== expectedSignature) {
      throw boomify(new Error('Invalid signature'), { statusCode: 401 });
    }
  
    // Authentication succeeded, return the credentials
    const returnData = createUserDataObject(result.user, result.registrationDate, apiKey, result._id);

    return { isValid: true, credentials: { userData: returnData } };
  }
  
};

const authScheme = function (server, options) {
  return {
    authenticate: async function (request, h) {
      const apiKey = request.headers['x-api-key'];

      if (!apiKey) {
        throw boomify(new Error('Missing API key'), { statusCode: 403 });
      }

      try {
        const { isValid, credentials } = await validateFunc(request, apiKey, h);
        if (isValid) {
          return h.authenticated({ credentials });
        } else {
          throw boomify(new Error('Invalid credentials'), { statusCode: 401 });
        }
      } catch (err) {
        throw boomify(err, { statusCode: 401 });
      }
    }
  };
};

function getPopulatedRecordsAsync(criteria, projection, populate) {
  return new Promise((resolve, reject) => {
    Service.ServiceInfoService.getPopulatedRecords(criteria, projection, populate, (err, result) => {
      if (err || result.length == 0) {
        reject(err || new Error('No records found'));
      } else {
        resolve(result[0]);
      }
    });
  });
}

const createUserDataObject = (user, registrationDate, apiKey, apiKeyId) => {
  return {
    _id: apiKeyId,
    createdAt: registrationDate,
    updatedAt: registrationDate,
    userId: user._id,
    accessToken: apiKey,
    deviceType: 'MACHINE',
    deviceName: 'MACHINE',
    deviceUUID: 'MACHINE',
    type: 'MACHINE',
    __v: 0
  }
}

exports.plugin = {
  name: 'm2m-auth',
  register: function (server, options) {
    server.auth.scheme('m2m-auth', authScheme);
    server.auth.strategy('M2MAuth', 'm2m-auth');
  }
};