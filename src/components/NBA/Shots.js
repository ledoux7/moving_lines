import { Button, CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { useGetShotLog } from '../../hooks/analytics';
import ShotChart from './ShotChart/ShotChart';
import NBADropdown from './SubComp/NBADropdown';

const parseKeys = ['LOC_X', 'LOC_Y', 'SHOT_PTS', 'TIME', 'TIME_PER',
  'HOME_PTS', 'ROAD_PTS', 'SCOREMARGIN', 'ASSISTED', 'SCORE_DIFF', 'FGA', 'FGM', 'SHOT_VALUE', 'PERIOD',
];
const lowercaseKeys = obj => Object.keys(obj).reduce((acc, key) => {
  acc[key.toUpperCase()] = parseKeys.includes(key.toUpperCase())
    ? parseInt(obj[key], 10)
    : obj[key];
  return acc;
}, {});

function capitalize(s) {
  return s[0].toUpperCase() + s.slice(1);
}

const CHART_TYPES = {
  [true]: 'hexbin',
  [false]: 'scatter',
};

const Shots = () => {
  const history = useHistory();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const qPlayerName = query.get('playerName');
  const qChart = query.get('chart');

  const [player, setPlayer] = useState(qPlayerName);
  const [chartType, setChartType] = useState(qChart !== 'scatter');
  const [fixedData, setFixedData] = useState([]);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    status,
    isLoading,
    isError,
  } = useGetShotLog(player);

  useEffect(() => {
    if (data) {
      const biggie = data.pages
        .reduce((acc, cur) => acc.concat([...cur.Items.map(s => lowercaseKeys(s))]), []);

      const nn = biggie.reduce((acc, cur, i) => {
        const nObj = {
          ...cur,
          x: (cur.LOC_X + 250) / 10,
          y: (cur.LOC_Y + 50) / 10,
          shotid: i,
          id: cur.PLAYER_ID,

        };

        return acc.concat([nObj]);
      }, []);

      setFixedData(nn);
    }
    else {
      setFixedData([]);
    }

    return () => {

    };
  }, [data]);

  const gotoPlay = (...rest) => {
    console.log('cbbb', rest);
    history.push({
      pathname: '/shots',
      search: '?playerName=' + player + '&chart=' + CHART_TYPES[chartType],
    });
    history.push(`/play?gameId=${rest[0]}&eventNum=${rest[1]}&eventType=${rest[2]}`);
  };

  // console.log({ data1: data, fixedData });
  return (
    <div style={{
      display: 'flex',
      // flex: 1,
      width: 800,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',

    }}
    >
      <div style={{
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
        paddingTop: 20,
        justifyContent: 'space-evenly',
      }}
      >
        <NBADropdown type='Player' callback={setPlayer} />

        <Button
          variant='contained'
          style={{
            textTransform: 'none',
            width: 260,
            fontSize: 26,
            marginTop: 10,
          }}
          color='primary'
          onClick={() => setChartType(cur => !cur)}
        >
          Switch To {capitalize(CHART_TYPES[!chartType])}
        </Button>

      </div>
      <h2 style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
        margin: 0,
        paddingTop: 10,
      }}
      >
        {player}
      </h2>

      <div style={{
        width: 600,
      }}
      >
        <ShotChart
          data={fixedData}
          playerId={'203952'}
          minCount={3}
          chartType={CHART_TYPES[chartType]}
          displayToolTips
          width={650}
          namee={'p1'}
          callback={gotoPlay}
        />
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {isLoading && <CircularProgress />}
        <Button
          variant='contained'
          style={{
            textTransform: 'none',
            width: 300,
            fontSize: 26,
            marginTop: 10,
          }}
          color='primary'
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Add 100 Shots More'
              : 'Nothing more to load'}
        </Button>
      </div>

    </div>
  );
};

export default Shots;
