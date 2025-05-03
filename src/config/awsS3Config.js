/*
*Please add project folder name and ibm bucket name here,
* make sure project folder name does not have spaces in between and is same
* as the name you give while running upload_setup.sh
*/
var s3BucketCredentials = {
  "projectFolder": "schare-backend",
  "bucket": "schare-backend",
  "accessKeyId": "process.env.AWS_ACCESS_KEY_ID",
  "secretAccessKey": "process.env.AWS_SECRET_ACCESS_KEY",
  "s3URL": "process.env.AWS_S3_URL",
  "folder": {
    "profilePicture": "profilePicture",
    "thumb": "thumb",
    "original": "original",
    "image": "image",
    "docs": "docs",
    "files": "files",
    "video": "video",
    "audio": "audio"
  }
};
export default {
  s3BucketCredentials: s3BucketCredentials
};