/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import {
  Button, CircularProgress, IconButton, Tooltip,
} from '@material-ui/core';
import { Cached } from '@material-ui/icons';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useQuery, useQueries, useMutation } from 'react-query';
import { useLocation } from 'react-router';
import { fetchFromDynamoDb, fetchViaProxy } from '../../api';

const PlayPBP = pbpData => {
  const [sourceUrl, setSourceUrl] = useState(null);
  const [dsc, setDsc] = useState(null);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const eventNum = query.get('eventNum');
  const eventType = query.get('eventType');

  const vidRef = useRef(null);

  const {
    isLoading, isError, error, data, refetch, isSuccess,
  } = useQuery(
    {
      queryKey: ['play', { gameId, eventNum, eventType }],
      queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  const ended = useCallback(
    () => {
      console.log('ended');
    },
    [],
  );

  const onPlaying = useCallback(
    () => {
      console.log('playing');
      // vidRef.current.playbackRate = 1.5;
    },
    [],
  );

  useEffect(() => {
    if (data && data.Item) {
      setSourceUrl(data.Item.UrlHigh);
      setDsc(data.Item.Dsc);
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
      {isError && <h1>Error, try fetch again</h1>}
      {(isLoading) && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}
        >
          <CircularProgress />
        </div>
      )}

      {(sourceUrl) && (
        [
          <h1>
            {dsc}
            <Tooltip title={'Refetch'} placement='top'>
              <IconButton
                aria-label='delete'
                onClick={() => refetch()}
              >
                <Cached fontSize='large' />
              </IconButton>
            </Tooltip>
          </h1>,
          <video
            onEnded={ended}
            onPlaying={onPlaying}
            ref={vidRef}
            autoPlay
            muted
            style={{
              // width: '100%',
              maxHeight: 'calc(100vh - 220px)',
              // paddigTop: 40,
            }}
            controls
            src={sourceUrl}
          />,
        ]
      )}

    </div>
  );
};

PlayPBP.propTypes = {

};

export default PlayPBP;
