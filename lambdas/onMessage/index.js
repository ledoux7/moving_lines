const AWS = require('aws-sdk');

const ddb = new AWS.DynamoDB.DocumentClient();

let apiGatewayManagementApi;
const tableName = 'Connections';
const apiVersion = '2018-11-29';

function initApiGatewayManagementApi(event) {
  apiGatewayManagementApi = new AWS.ApiGatewayManagementApi({
    apiVersion,
    endpoint: event.requestContext.domainName + '/' + event.requestContext.stage,
  });
}

async function send(connectionId, data) {
  if (apiGatewayManagementApi) {
    await apiGatewayManagementApi.postToConnection({
      ConnectionId: connectionId,
      Data: data,
    }).promise();
  }
}

function getConnections() {
  return ddb.scan({ TableName: tableName }).promise();
}

exports.handler = (event, context, callback) => {
  console.log('onMsg', event);
  initApiGatewayManagementApi(event);
  const message = JSON.stringify({ message: JSON.parse(event.body).message });
  getConnections().then(data => {
    data.Items.forEach(connection => {
      send(connection.connectionId, message);
    });
    callback(null, { statusCode: 200 });
  });
};
