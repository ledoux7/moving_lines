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

const getUrlBoxScore = gameId => (
  `${baseUrl}ml/boxscore?gameId=${gameId}`
);

const getUrlShotLog = (playerName, NextToken, QueryExecutionId) => (
  `${baseUrl}ml/shots/player?playerName=${playerName}&NextToken=${NextToken}&QueryExecutionId=${QueryExecutionId}`
);

const getUrlGames = (NextToken, QueryExecutionId) => (
  `${baseUrl}ml/games?NextToken=${NextToken}&QueryExecutionId=${QueryExecutionId}`
);

const getUrlRandomShotsPlayer = (playerName, fg3) => (
  `${baseUrl}ml/random/shots/player${fg3}?playerName=${playerName}`
);

const getUrlRandomShotsTeam = (team, fg3) => (
  `${baseUrl}ml/random/shots/team${fg3}?team=${team}`
);

const getUrlRandomShotsOpp = (team, fg3) => (
  `${baseUrl}ml/random/shots/opp${fg3}?team=${team}`
);

const getUrlPlayerNames = () => (
  `${baseUrl}ml/players`
);

const getUrlTeamNames = () => (
  `${baseUrl}ml/teams`
);

const getUrlIsItFoulPlayer = (playerName, gameId) => (
  `${baseUrl}ml/isit/foul?playerName=${playerName}${gameId ? '&gameId=' + gameId : ''}`
);

export const fetchViaProxy = async ({ queryKey }) => {
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
  const res = await axios.get(url);
  return res?.data;
};

export const fetchBoxScore = async ({
  queryKey,
}) => {
  const url = getUrlBoxScore(queryKey[1]);
  const res = await axios.get(url);
  return res?.data;
};

export const fetchShotLog = async ({
  pageParam = {
    NextToken: '',
    QueryExecutionId: '',
  },
  queryKey,
}) => {
  const url = getUrlShotLog(queryKey[1], pageParam.NextToken, pageParam.QueryExecutionId);
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
  const res = await axios.get(url);
  return res?.data;
};

export const fetchRandomShotsPlayer = async ({ queryKey }) => {
  console.log('keyProxy', queryKey);
  const [_key, { playerName, fg3 }] = queryKey;
  if (playerName === undefined) {
    throw new Error('bad params');
  }
  const res = await axios.get(getUrlRandomShotsPlayer(encodeURIComponent(playerName), fg3));
  return res?.data;
};

export const fetchIsItFoulPlayer = async ({ queryKey }) => {
  console.log('keyProxy', queryKey);
  const [_key, { playerName, gameId }] = queryKey;
  if (playerName === undefined) {
    throw new Error('bad params');
  }
  const res = await axios.get(getUrlIsItFoulPlayer(encodeURIComponent(playerName), gameId));
  return res?.data;
};

export const fetchRandomShotsTeam = async ({ queryKey }) => {
  console.log('keyProxy', queryKey);
  const [_key, { team, fg3 }] = queryKey;
  if (team === undefined) {
    throw new Error('bad params');
  }
  const res = await axios.get(getUrlRandomShotsTeam(team, fg3));
  return res?.data;
};

export const fetchRandomShotsOpp = async ({ queryKey }) => {
  console.log('keyProxy', queryKey);
  const [_key, { team, fg3 }] = queryKey;
  if (team === undefined) {
    throw new Error('bad params');
  }
  const res = await axios.get(getUrlRandomShotsOpp(team, fg3));
  return res?.data;
};

export const fetchPlayerNames = async () => {
  const res = await axios.get(getUrlPlayerNames());
  return res?.data;
};
export const fetchTeamNames = async () => {
  const res = await axios.get(getUrlTeamNames());
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
