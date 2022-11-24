const authorize = async (event, context) => {
    let date = new Date();
    let minutes = date.getMinutes()
    let hour = date.getHours()
    if (event.authorizationToken === `Bearer ${process.env.SECRET_EGG}-${hour}-${minutes}`) {
        return {
            principalId: 'anonymous',
            policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                Action: 'execute-api:Invoke',
                Effect: 'Allow',
                Resource: event.methodArn,
                },
            ],
            },
        };
    }
    throw Error('Unauthorized');
}
module.exports = { authorize }