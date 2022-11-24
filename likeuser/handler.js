const AWS = require("aws-sdk")

let DBClientParams = {}
const dynamoDB = new AWS.DynamoDB.DocumentClient(DBClientParams)
function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}
const likeuser = async (event, context) => {
    const body = event.Records[0].body
    const userid = JSON.parse(body).id
    console.log(userid)
    const params = {
        TableName: 'usersTable',
        Key: { pk: userid },
        UpdateExpression: "ADD likes :inc",
        ExpressionAttributeValues: {
            ':inc': 1
        },
        ReturnValues: 'ALL_NEW'
    }
    const result = await dynamoDB.update(params).promise()
    await sleep(4000)
    console.log(result)
}
module.exports = { likeuser }