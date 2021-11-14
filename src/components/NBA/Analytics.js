/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import {
  useQuery, useQueries, useMutation, useInfiniteQuery,
} from 'react-query';
import { useHistory } from 'react-router';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP,
} from '../../api';
import { useGetGames, useGetPBPForGame } from '../../hooks/analytics';

const Replayer = () => {
  const [curPlay, setCurPlay] = useState(null);
  const [curLoaded, setCurLoaded] = useState(false);
  const [page, setPage] = React.useState(0);
  const [nextToken, setNextToken] = React.useState('');
  const [queryId, setQueryId] = React.useState('');
  const [gameId2, setGameId2] = React.useState('0022100079');

  const history = useHistory();
  const handleSubmit = gameId => {
    history.push('/pbp?gameId=' + gameId, { gameId });
  };

  const vidRef = useRef(null);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetGames();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      // overflow: 'scroll',
    }}
    >
      <h1>Analytics</h1>

      <div style={{
        display: 'flex',
        overflow: 'scroll',
        flexWrap: 'wrap',
      }}
      >
        {(data && data.pages) && data.pages.map((group, i) => (
          group.Items.map(game => (
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
              onClick={() => handleSubmit(game.game_id)}
            >
              {game.matchup}
            </Button>
          ))
        ))}
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
      </div>

      <div>
        <button
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
        >
          {isFetchingNextPage
            ? 'Loading more...'
            : hasNextPage
              ? 'Load More'
              : 'Nothing more to load'}
        </button>
      </div>

    </div>
  );
};

Replayer.propTypes = {

};

export default Replayer;
