/**
 * Created by Sanchit
 */
import User from './user';
import Admin from './admin';
import Token from './token';
import SSO from './sso';
import MLJob from "./job";
import Data from "./data";
import Service from "./service";
import ServiceGroup from "./serviceGroup";
import UserProfile from "./userProfile";
import ServiceInfo from "./serviceInfo";

const ForgetPassword = require('./forgotPasswordRequest');

export default {
  User,
  UserProfile,
  MLJob,
  ForgetPassword,
  Admin,
  Token,
  SSO,
  Service,
  ServiceGroup,
  Data,
  ServiceInfo
}
