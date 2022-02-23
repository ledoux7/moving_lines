/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button, CircularProgress } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  useQuery, useQueries, useMutation, useInfiniteQuery,
} from 'react-query';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP,
} from '../../api';
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
  const [curPlay, setCurPlay] = useState(null);
  const [curLoaded, setCurLoaded] = useState(false);
  const [page, setPage] = React.useState(0);
  const [nextToken, setNextToken] = React.useState('');
  const [queryId, setQueryId] = React.useState('');
  const [gameId2, setGameId2] = React.useState('0022100079');
  const [grouped, setGrouped] = React.useState();

  const history = useHistory();
  const handleSubmit = gameId => {
    history.push('/game?gameId=' + gameId, { gameId });
  };

  const vidRef = useRef(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
    isError,
  } = useGetGames();

  useEffect(() => {
    if (data) {
      const biggie = data.pages.reduce((acc, cur) => acc.concat([...cur.Items]), []);
      const grp = groupBy(biggie, g => g.game_date);
      const obj = Object.fromEntries(grp);

      setGrouped(obj);
    }
  }, [data]);

  console.log('gr', grouped);

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
      }}
      >
        {isLoading && <CircularProgress />}

        {(grouped) && Object.entries(grouped).map((dateGroup, i) => (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            // flexDirection: 'column',
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
            marginTop: 10,
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
