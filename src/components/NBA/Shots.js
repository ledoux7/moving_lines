import { Button, CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useGetShotLog } from '../../hooks/analytics';
import ShotChart from './ShotChart/ShotChart';

const parseKeys = ['LOC_X', 'LOC_Y', 'SHOT_PTS', 'TIME', 'TIME_PER',
  'HOME_PTS', 'ROAD_PTS', 'SCOREMARGIN', 'ASSISTED', 'SCORE_DIFF', 'FGA', 'FGM', 'SHOT_VALUE', 'PERIOD',
];
const lowercaseKeys = obj => Object.keys(obj).reduce((acc, key) => {
  acc[key.toUpperCase()] = parseKeys.includes(key.toUpperCase())
    ? parseInt(obj[key], 10)
    : obj[key];
  return acc;
}, {});

const Shots = () => {
  const a = 123;
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
  } = useGetShotLog('Andrew Wiggins');

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

    return () => {

    };
  }, [data]);

  console.log({ data1: data, fixedData });

  return (
    <div style={{
      // display: 'flex',
      // flex: 1,
      width: 800,
      height: 600,
      // background: 'rgb(69, 81, 98)',
    }}
    >
      {
        // isSuccess && fixedData
        true
        && (
          <ShotChart
            data={fixedData}
            playerId={'203952'}
            minCount={3}
            chartType={'hexbin'}
            // chartType={'scatter'}
            displayToolTips
            width={700}
            namee={'p1'}
          />
        )
      }

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
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
