const AWS = require('aws-sdk');
const util = require('util');
const sharp = require('sharp');
const s3 = new AWS.S3();

const thumbnailGenerator = async (event, context) => {
    console.log("Reading options from event:\n", util.inspect(event, {depth: 5}));
    const srcBucket = event.Records[0].s3.bucket.name;
    console.log(event.Records[0].s3.object)
    const srcKey    = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "));
    console.log(srcKey)

    const typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
      console.log("Could not determine the image type.");
      return;
    }

    const imageType = typeMatch[1].toLowerCase();
    if (imageType != "jpg" && imageType != "png") {
      console.log(`Unsupported image type: ${imageType}`);
      return;
    }

    let origimage = null
    try {
      const params = {
        Bucket: srcBucket,
        Key: srcKey
      };

      origimage = await s3.getObject(params).promise();

    } catch (error) {
      console.log(error);
      return;
    }

    const widths  = [50,100,200];

    for (const w of widths) {
      await resizer(origimage.Body, w, srcBucket, srcKey)
    }
};

const resizer = async (imgBody, newSize, dstBucket, fileKey ) => {

  const nameFile = fileKey.split('/')[1]
  const dstKey = `resized/${newSize}-${nameFile}`;
  let buffer = null
  try {
    buffer = await sharp(imgBody).resize(newSize).toBuffer();

  } catch (error) {
    console.log(error);
    return;
  }


  try {
    const destparams = {
      Bucket: dstBucket,
      Key: dstKey,
      Body: buffer,
      ContentType: "image"
    };

    await s3.putObject(destparams).promise();

    } catch (error) {
      console.log(error);
      return;
    }

    console.log('Successfully resized ' + dstBucket + '/' + fileKey +
      ' and uploaded to ' + dstBucket + '/' + dstKey);

}

module.exports = {
    thumbnailGenerator
}