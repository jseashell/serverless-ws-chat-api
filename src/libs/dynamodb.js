const {
  DeleteItemCommand,
  DynamoDBClient,
  PutItemCommand,
  ScanCommand,
} = require('@aws-sdk/client-dynamodb');

/**
 * @return a new DynamoDBClient to send commands to
 */
const newClient = () => new DynamoDBClient({ region: process.env.REGION });

/**
 * Puts a connection ID in the database
 * @param {string} connectionId to insert
 * @returns a Promise containing the inserted database item
 */
module.exports.putItem = async (connectionId) => {
  const command = new PutItemCommand({
    TableName: process.env.CONNECTION_TABLE,
    Item: {
      connectionId: {
        S: connectionId,
      },
    },
  });

  return newClient().send(command);
};

/**
 * Deletes a connection ID in the database
 * @param {string} connectionId to delete
 * @returns a Promise containing the deleted database item
 */
module.exports.deleteItem = async (connectionId) => {
  const command = new DeleteItemCommand({
    TableName: process.env.CONNECTION_TABLE,
    Key: {
      connectionId: {
        S: connectionId,
      },
    },
  });

  return newClient().send(command);
};

/**
 * Scans the databse for all items with a connection ID property
 * @returns a Promise containing database items
 */
module.exports.scan = async () => {
  const command = new ScanCommand({
    TableName: process.env.CONNECTION_TABLE,
    ProjectionExpression: 'connectionId',
  });

  return newClient().send(command);
};
