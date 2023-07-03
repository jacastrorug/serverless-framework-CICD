const aws = require("aws-sdk");

let dynamoDBClientParams = {}; // the client by default will point to a default DB in the cloud

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const getUsers = async (event, context) => {
  console.log(event);
  const userId = event.pathParameters.id;

  const params = {
    ExpressionAttributeValues: {
      ":pk": userId,
    },
    KeyConditionExpression: "pk = :pk",
    TableName: "usersTable",
  };

  return dynamodb
    .query(params)
    .promise()
    .then((response) => {
      console.log(response);

      if (!response.Items || response.Items.length === 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "User not found" }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify({ user: response.Items[0] }),
      };
    });
};

module.exports = {
  getUsers,
};
