import axios from 'axios';

const createPBPUrl = (gameId, eventNum, eventType) => (
  `https://24dm4ps6a8.execute-api.eu-west-1.amazonaws.com/prod/pbp?eventType=${eventType}&eventNum=${eventNum}&gameId=${gameId}`
);

const createPBPUrlDynamoDB = (gameId, eventNum, eventType) => (
  `https://24dm4ps6a8.execute-api.eu-west-1.amazonaws.com/prod/pbp_url?eventType=${eventType}&eventNum=${eventNum}&gameId=${gameId}`
);

const baseUrl = 'https://24dm4ps6a8.execute-api.eu-west-1.amazonaws.com/prod/';

const getUrlPBP = (gameId, NextToken, QueryExecutionId) => (
    `${baseUrl}ml/pbp?gameId=${gameId}&NextToken=${NextToken}&QueryExecutionId=${QueryExecutionId}`
);

const getUrlGames = (NextToken, QueryExecutionId) => (
  `${baseUrl}ml/games?NextToken=${NextToken}&QueryExecutionId=${QueryExecutionId}`
);

const getUrlRandomShotsPlayer = playerName => (
  `${baseUrl}ml/random/shots/player?playerName=${playerName}`
);

const getUrlPlayerNames = () => (
  `${baseUrl}ml/players`
);

export const fetchViaProxy = async ({ queryKey }) => {
  console.log('keyProxy', queryKey);
  const [_key, { gameId, eventNum, eventType }] = queryKey;
  if (eventNum === undefined || eventType === undefined) {
    throw new Error('bad params');
  }
  const res = await axios.get(createPBPUrl(gameId, eventNum, eventType));
  return res?.data;
};

export const fetchFromDynamoDb = async ({ queryKey }) => {
  console.log('keyDB', queryKey);
  const [_key, { gameId, eventNum, eventType }] = queryKey;
  if (eventNum === undefined || eventType === undefined) {
    throw new Error('bad params');
  }

  const res = await axios.post(createPBPUrlDynamoDB(gameId, eventNum, eventType));

  if (!res?.data?.Item) {
    throw new Error('no data');
  }
  return res?.data;
};

export const fetchWrapper = async ({ queryKey }) => {
  console.log('key', queryKey);
  const [_key, { gameId, eventNum, eventType }] = queryKey;
  const res = await axios.post(createPBPUrlDynamoDB(gameId, eventNum, eventType));
  return res?.data;
};

export const fetchPBP = async ({
  pageParam = {
    NextToken: '',
    QueryExecutionId: '',
  },
  queryKey,
}) => {
  // console.log('getstuff', pageParam, queryKey);
  const url = getUrlPBP(queryKey[1], pageParam.NextToken, pageParam.QueryExecutionId);
  console.log({ url });

  const res = await axios.get(url);
  return res?.data;
};

export const fetchGames = async ({
  pageParam = {
    NextToken: '',
    QueryExecutionId: '',
  },
  queryKey,
}) => {
  // console.log('getstuff', pageParam, queryKey);
  const url = getUrlGames(pageParam.NextToken, pageParam.QueryExecutionId);
  console.log({ url });

  const res = await axios.get(url);
  return res?.data;
};

export const fetchRandomShotsPlayer = async ({ queryKey }) => {
  console.log('keyProxy', queryKey);
  const [_key, { playerName }] = queryKey;
  if (playerName === undefined) {
    throw new Error('bad params');
  }
  const res = await axios.get(getUrlRandomShotsPlayer(encodeURIComponent(playerName)));
  return res?.data;
};

export const fetchPlayerNames = async () => {
  const res = await axios.get(getUrlPlayerNames());
  return res?.data;
};

export const fetchPlayUrl = async ({
  pageParam = {
    eventNum: '',
    eventType: '',
  },
  queryKey,
}) => {
  // console.log('getstuff', pageParam, queryKey);
  const url = createPBPUrlDynamoDB(queryKey[1], pageParam.eventNum, pageParam.eventType);
  console.log({ url });
  const res = await axios.post();

  return res?.data;
};

export const fetchPlayUrl1 = async ({
  pageParam = {
    eventNum: '',
    eventType: '',
  },
  queryKey,
}) => {
  // console.log('getstuff', pageParam, queryKey);
  const url = createPBPUrlDynamoDB(queryKey[1], pageParam.eventNum, pageParam.eventType);
  console.log({ url });
  const res = await axios.post();

  return res?.data;
};
