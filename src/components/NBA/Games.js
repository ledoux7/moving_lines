/* eslint-disable react/no-array-index-key */
/* eslint-disable react/jsx-key */
/* eslint-disable react/button-has-type */
import { Button, CircularProgress } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { useGetGames, useGetPBPForGame } from '../../hooks/analytics';

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

const Games = () => {
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
  } = useGetGames();

  useEffect(() => {
    if (data) {
      const biggie = data.pages.reduce((acc, cur) => acc.concat([...cur.Items]), []);
      const grp = groupBy(biggie, g => g.game_date);
      const obj = Object.fromEntries(grp);

      setGrouped(obj);
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) { // first load only
      fetchNextPage();
    }
  }, [fetchNextPage, isSuccess]);

  // console.log('gr', grouped);
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      // overflow: 'scroll',
    }}
    >
      <h1>Recent Games</h1>

      <div style={{
        display: 'flex',
        overflow: 'scroll',
        flexWrap: 'wrap',
        justifyContent: 'center',
        height: '80vh',
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
                  component={Link}
                  to={'/game?gameId=' + game.game_id}
                  variant='contained'
                  style={{
                    textTransform: 'none',
                    width: 180,
                    height: 55,
                    fontSize: 26,
                    margin: '10px 10px',
                  }}
                  color='primary'
                  onClick={() => handleSubmit(game.game_id)}
                >
                  {game.matchup}
                </Button>
              ))}
            </div>

          </div>
        ))}

        { isError && (
          <Button
            variant='contained'
            style={{
              textTransform: 'none',
              width: 200,
              height: 55,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            onClick={() => handleSubmit('0022100016')}
          >
            {'LAC-GSW'}
          </Button>
        )}
      </div>

      <div>
        <Button
          variant='contained'
          style={{
            textTransform: 'none',
            width: 300,
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

Games.propTypes = {

};

export default Games;
