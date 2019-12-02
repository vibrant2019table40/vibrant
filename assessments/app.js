let response;

const dbRegion = process.env.DynamoDBRegion;
const dbTable = process.env.DynamoDBTable;

// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');

// Set the region
AWS.config.update({ region: dbRegion });

// Create DynamoDB document client
var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

class ApiError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
exports.lambdaHandler = async (event, context) => {
  try {
    let data = null;

    switch (event.httpMethod) {
      case 'GET':
        data = await getItem(event.pathParameters.key);
        break;
      case 'POST':
        data = await saveItem(event.pathParameters.key, JSON.parse(event.body));
        break;
      default:
        throw new Error(`No route found for http method: ${event.httpMethod} ${event.path}`);
    }

    response = {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (err) {
    console.log(`ERROR: code=${err.code} ${err}`);
    response = {
      statusCode: err.code || 500,
      body: JSON.stringify({ message: err.message })
    };
  }

  return response;
};

const getItem = async key => {
  if (!key) {
    throw new ApiError(400, `Key is required`);
  }
  var params = {
    TableName: dbTable,
    Key: { CallerKey: key }
  };
  const data = await docClient.get(params).promise();
  if (!data.Item) {
    throw new ApiError(404, `Key not found: ${key}`);
  }
  return data.Item;
};

const saveItem = async (key, data) => {
  if (!key) {
    throw new ApiError(400, `Key is required`);
  }
  if (!data) {
    throw new ApiError(400, `Body is required`);
  }
  var params = {
    TableName: dbTable,
    Item: {
      CallerKey: key,
      Data: data
    }
  };
  await docClient.put(params).promise();
  return {
    success: true
  };
};
