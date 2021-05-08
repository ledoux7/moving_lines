const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

const tableName = 'Connections';

function deleteConnectionId(connectionId) {
  return ddb.delete({
    TableName: tableName,
    Key: {
      connectionId,
    },
  }).promise();
}

exports.handler = (event, context, callback) => {
  const { connectionId } = event.requestContext;
  deleteConnectionId(connectionId).then(() => {
    callback(null, { statusCode: 200 });
  });
};
