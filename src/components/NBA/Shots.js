import { Button, CircularProgress } from '@material-ui/core';
import React, {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import debounce from 'lodash.debounce';
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

function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }

    const debouncedSet = debounce(updateSize, 300, {
      leading: true,
      trailing: true,
    });

    window.addEventListener('resize', debouncedSet);
    updateSize();
    return () => window.removeEventListener('resize', debouncedSet);
  }, []);
  return size;
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
  const ref = useRef(null);
  const [width, height] = useWindowSize();

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
    <div
      style={{
        display: 'flex',
        // flex: 1,
        width: 800,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',

      }}
      ref={ref}
    >
      <div style={{
        display: 'flex',
        width: '100%',
        flexWrap: 'wrap',
        paddingTop: 15,
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
        height: 40,
        alignItems: 'center',
      }}
      >
        {player}
        {isLoading && <CircularProgress style={{ marginLeft: 20 }} />}
      </h2>

      <div style={{
        width: 600,
      }}
      >
        <ShotChart
          // key={width * 0.75}
          data={fixedData}
          playerId={'203952'}
          minCount={3}
          chartType={CHART_TYPES[chartType]}
          displayToolTips
          width={width * 0.75}
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
              ? 'Add 500 Shots More'
              : 'Nothing more to load'}
        </Button>
      </div>

    </div>
  );
};

export default Shots;
