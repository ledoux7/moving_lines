const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Connections';

function addConnection(connectionId) {
  return ddb.put({
    TableName: tableName,
    Item: {
      connectionId,
    },
  }).promise();
}

exports.handler = (event, context, callback) => {
  const { connectionId } = event.requestContext;
  addConnection(connectionId).then(() => {
    callback(null, { statusCode: 200 });
  });
};
