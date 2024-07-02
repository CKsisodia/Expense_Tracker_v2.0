require("dotenv").config();
const AWS = require("aws-sdk");

exports.uploadFilesToS3 = async (data, fileName) => {
  const bucketName = process.env.BUCKET_NAME;
  const iamUserAccessKey = process.env.IAM_USER_ACCESS_KEY;
  const iamUserSecretKey = process.env.IAM_USER_SECRET_KEY;

  let s3Bucket = new AWS.S3({
    accessKeyId: iamUserAccessKey,
    secretAccessKey: iamUserSecretKey,
  });

  const params = {
    Bucket: bucketName,
    Key: fileName,
    Body: data,
    ACL: "public-read",
  };

  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3Response) => {
      if (err) {
        console.log("Something went wrong");
        reject(err);
      } else {
        console.log(s3Response)
        resolve(s3Response);
      }
    });
  });
};
