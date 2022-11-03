/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
/* eslint-disable react/button-has-type */
import { Button, CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useGetGames, useGetPBPForGame, useGetSchedule } from '../../hooks/analytics';

function groupBy(list, keyGetter) {
  const map = new Map();
  list.forEach(item => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    }
    else {
      collection.push(item);
    }
  });
  return map;
}

const Schedule = () => {
  const [grouped, setGrouped] = React.useState();

  const history = useHistory();
  const handleSubmit = gameId => {
    history.push('/game?gameId=' + gameId, { gameId });
  };

  const vidRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isSuccess,
  } = useGetSchedule();

  useEffect(() => {
    if (data) {
      const grp = groupBy(data, g => g.GAME_DATE);
      const obj = Object.fromEntries(grp);

      setGrouped(obj);
    }
  }, [data]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
    }}
    >
      <h1>Schedule</h1>

      <div style={{
        display: 'flex',
        overflow: 'scroll',
        flexWrap: 'wrap',
        justifyContent: 'center',
        height: '76vh',
      }}
      >
        {isLoading && <CircularProgress />}

        {(grouped) && Object.entries(grouped).map((dateGroup, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
            }}
          >
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              flexDirection: 'column',
            }}
            >
              <h3 style={{
                textAlign: 'center',
                margin: 0,

              }}
              >
                {dateGroup[0]}
              </h3>

              { dateGroup[1].map(game => (
                <Button
                  key={'button' + game.GAME_ID}
                  component={Link}
                  to={'/betting?gameId=' + game.GAME_ID}
                  variant='contained'
                  style={{
                    textTransform: 'none',
                    width: 180,
                    height: 55,
                    fontSize: 26,
                    margin: '10px 10px',
                  }}
                  color='primary'
                  // onClick={() => handleSubmit(game.GAME_ID)}
                >
                  {game.MATCHUP}
                </Button>
              ))}
            </div>

          </div>
        ))}
      </div>

      <div style={{
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
      }}
      >
        <Button
          variant='contained'
          style={{
            textTransform: 'none',
            width: 300,
            height: 55,
            fontSize: 26,
          }}
          color='primary'
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load Next 25'
              : 'Nothing more to load'}
        </Button>
      </div>
    </div>
  );
};

Schedule.propTypes = {

};

export default Schedule;
