const aws = require("aws-sdk")

const s3 = new aws.S3({
    signatureVersion: 'v4'
})

const signed = async (event, context) => {

    const filename = event.queryStringParameters.filename

    const signedURL = await s3.getSignedUrlPromise("putObject", {
        Key: filename,
        Bucket: process.env.BUCKET,
        Expires: 300,
    })

    return {
        "statusCode": 200,
        "body": JSON.stringify({ signedURL })
    }
}

module.exports = {
    signed
}