/* eslint-disable react/display-name */
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
import { useHistory, useLocation } from 'react-router';
import Slider from '@material-ui/core/Slider';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP,
} from '../../api';
import { useGetPBPForGame } from '../../hooks/analytics';

const PlaySelector = React.memo(({
  value, data, fetchNextPage, isFetchingNextPage, hasNextPage,
}) => {
  // const eventUpdates = React.useRef(0);

  const history = useHistory();
  const handleSubmit = (gameIdParam, eventNum, eventType) => {
    history.push(`/play?gameId=${gameIdParam}&eventNum=${eventNum}&eventType=${eventType}`);
  };

  console.log('render');
  return (
    <div style={{
      overflow: 'scroll',
    }}
    >
      {value}
      {(data && data.pages) && data.pages.map((group, i) => (
        group.Items.map(play => (
          <Button
            variant='contained'
            style={{
              textTransform: 'none',
              width: 200,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            onClick={() => handleSubmit(play.game_id, play.eventnum, play.event_type_id)}
          >
            {play.home_dsc || play.neutral_dsc || play.road_dsc }
          </Button>
        ))
      ))}
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
  );
});

export default PlaySelector;
