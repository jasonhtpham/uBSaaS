import UserBaseRoute from "./userRoute/userBaseRoute";
import UserProfileRoute from "./userRoute/userProfileRoute";
import AdminBaseRoute from "./adminRoute/adminBaseRoute";
import UploadBaseRoute from "./uploadRoute/uploadBaseRoute";
import JobBaseRoute from "./jobRoute/jobBaseRoute";
import DataBaseRoute from "./dataRoute/dataBaseRoute";
import JobStatusUpdateRoute from "./jobRoute/jobStatusUpdateRoute";
import ServiceRoute from "./ServiceRoute/ServiceRoute";
import ServiceAdminRoute from "./ServiceRoute/ServiceAdminRoute";
import GatawayRoute from "./gatewayRoute/gatewayBaseRoute";
import ProfileBaseRoute from "./profileRoute/profileBaseRoute";
import InfoBaseRoute from "./infoRoute/infoBaseRoute";


const Routes = [].concat(
  DataBaseRoute,
  UserBaseRoute,
  UserProfileRoute,
  AdminBaseRoute,
  UploadBaseRoute,
  JobBaseRoute,
  JobStatusUpdateRoute,
  ServiceRoute,
  ServiceAdminRoute,
  GatawayRoute,
  ProfileBaseRoute,
  InfoBaseRoute
);

export default Routes;
