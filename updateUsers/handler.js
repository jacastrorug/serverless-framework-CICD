const aws = require("aws-sdk");

let dynamoDBClientParams = {}; // the client by default will point to a default DB in the cloud

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
  };
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const updateUsers = async (event, context) => {
  const userId = event.pathParameters.id;
  const body = JSON.parse(event.body);

  const params = {
    TableName: "usersTable",
    Key: { pk: userId },
    UpdateExpression: "set #name = :name, #phone = :phone",
    ExpressionAttributeNames: {
      "#name": "name",
      "#phone": "phone"
    },
    ExpressionAttributeValues: {
      ":name": body.name,
      ":phone": body.phone
    },
    ReturnValues: "ALL_NEW"
  };

  return dynamodb
    .update(params)
    .promise()
    .then((response) => {
      console.log(response);

      return {
        statusCode: 200,
        body: JSON.stringify({ user: response.Attributes }),
      };
    });
};

module.exports = {
  updateUsers,
};
