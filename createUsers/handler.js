const aws = require("aws-sdk");
const random = require("crypto");

let dynamoDBClientParams = {};

if (process.env.IS_OFFLINE) {
  dynamoDBClientParams = {
    region: "localhost",
    endpoint: "http://localhost:8000",
    accessKeyId: 'DEFAULT_ACCESS_KEY',
    secretAccessKey: 'DEFAULT_SECRET'
  };
}

const dynamodb = new aws.DynamoDB.DocumentClient(dynamoDBClientParams);

const createUsers = async (event, context) => {
  const id = random.randomUUID();
  const userBody = JSON.parse(event.body);

  var params = {
    TableName: "usersTable",
    Item: { ...userBody, pk: id },
  };

  return dynamodb
    .put(params)
    .promise()
    .then((response) => {
      console.log(response);

      return {
        statusCode: 200,
        body: JSON.stringify({ user: params.Item }),
      };
    });
};

module.exports = {
  createUsers,
};
