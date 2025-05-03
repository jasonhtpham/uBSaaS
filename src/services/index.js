import GenericService from "./genericService";

import ForgetPasswordService from "./forgetPasswordService";

// import GenericRedisService from "./genericRedisService";

export default {
  JobService: new GenericService("MLJob"),
  DataService: new GenericService("Data"),
  UserService: new GenericService("User"),
  UserProfileService: new GenericService("UserProfile"),
  ForgetPasswordService,
  AdminService: new GenericService("Admin"),
  TokenService: new GenericService("Token"),
  SSOManagerService: new GenericService("SSO"),
  ServiceService: new GenericService("Service"),
  ServiceGroupService: new GenericService("ServiceGroup"),
  ServiceInfoService: new GenericService("ServiceInfo"),
  // RedisService: new GenericRedisService(),
};
