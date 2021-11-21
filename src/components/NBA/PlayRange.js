/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import {
  Button, CircularProgress, IconButton, Tooltip,
} from '@material-ui/core';
import { Cached, SkipNext, SkipPrevious } from '@material-ui/icons';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';

import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useQuery, useQueries, useMutation, useQueryClient,
} from 'react-query';
import { useLocation } from 'react-router';
import { fetchFromDynamoDb, fetchViaProxy } from '../../api';
import { useGetPBPForGame, useGetVideoUrlFresh } from '../../hooks/analytics';

const PlayRange = ({ cached }) => {
  const [curPlay, setCurPlay] = useState(0);
  const [curLoaded, setCurLoaded] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [err, setError] = useState(false);
  const [curEventNum, setCurEventNum] = useState();
  const [curEventType, setCurEventType] = useState();
  const [dsc, setDsc] = useState(null);

  const queryClient = useQueryClient();
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const startRange = query.get('start');
  const endRange = query.get('end');

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useGetPBPForGame(gameId);

  const pbpRange = useMemo(() => {
    const a = 123;
    if (data && data.pages && data.pages[0].Items) {
      return [...data.pages[0].Items.slice(startRange, endRange)];
    }
    return [];
  }, [data, endRange, startRange]);

  const videoUrl = useQuery(
    {
      queryKey: ['videoUrl', {
        gameId, eventNum: curEventNum, eventType: curEventType, cached,
      }],
      queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: attempt => 500 + attempt * 2000,
      enabled: curEventNum !== undefined,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  const vidRef = useRef(null);

  const tryNext = useCallback(
    (num = 1) => {
      for (let i = curPlay + num; i < pbpRange.length; i++) {
        if (pbpRange[i] && pbpRange[i].video !== '0') {
          setCurEventNum(pbpRange[i].eventnum);
          setCurEventType(pbpRange[i].event_type_id);
          setCurPlay(i);
          console.log('ended', pbpRange[i]);
          break;
        }
        console.log('skipped', pbpRange[i]);
      }
    },
    [curPlay, pbpRange],
  );

  const tryPrev = useCallback(
    (num = 1) => {
      for (let i = curPlay - num; i < pbpRange.length && i >= 0; i--) {
        if (pbpRange[i] && pbpRange[i].video !== '0') {
          setCurEventNum(pbpRange[i].eventnum);
          setCurEventType(pbpRange[i].event_type_id);
          setCurPlay(i);
          console.log('ended', pbpRange[i]);
          break;
        }
        console.log('skipped', pbpRange[i]);
      }
    },
    [curPlay, pbpRange],
  );

  const ended = useCallback(
    () => {
      tryNext();
    },
    [tryNext],
  );

  const onPlaying = useCallback(
    async () => {
      // vidRef.current.playbackRate = 1.5;

      for (let i = curPlay + 1; i < pbpRange.length; i++) {
        if (pbpRange[i] && pbpRange[i].video !== '0') {
          // eslint-disable-next-line no-await-in-loop
          await queryClient.prefetchQuery(
            {
              queryKey: ['videoUrl', {
                gameId, eventNum: pbpRange[i].eventnum, eventType: pbpRange[i].event_type_id, cached,
              }],
              queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
              refetchOnWindowFocus: false,
              retry: 0,
              // staleTime: 60 * 1000,
              refetchOnMount: false,
            },
          );
          break;
        }
      }
    },
    [cached, curPlay, gameId, pbpRange, queryClient],
  );

  useEffect(() => {
    if (pbpRange.length) {
      tryNext(0);
    }
  }, [pbpRange, tryNext]);

  useEffect(() => {
    if (videoUrl.data && videoUrl.data.Item) {
      setSourceUrl(videoUrl.data.Item.UrlHigh);
      setDsc(videoUrl.data.Item.Dsc);
    }
  }, [cached, videoUrl, videoUrl.data]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      overflow: 'scroll',
    }}
    >
      {videoUrl.isError && (
        <div style={{
          display: 'flex',
        }}
        >
          <h1>Error on {curEventNum}, try again</h1>
        </div>
      )}

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 10,
      }}
      >
        <Tooltip title={'Go Back 5'} placement='top'>
          <IconButton aria-label='delete' onClick={() => tryPrev(5)}>
            <SkipPrevious fontSize='large' />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Go Back'} placement='top'>
          <IconButton aria-label='delete' onClick={() => tryPrev()}>
            <NavigateBeforeIcon fontSize='large' />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Refetch'} placement='top'>
          <IconButton aria-label='delete' onClick={() => videoUrl.refetch()}>
            <Cached fontSize='large' />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Go Next'} placement='top'>
          <IconButton aria-label='delete' onClick={() => tryNext()}>
            <NavigateNextIcon fontSize='large' />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Go Next 5'} placement='top'>
          <IconButton aria-label='delete' onClick={() => tryNext(5)}>
            <SkipNext fontSize='large' />
          </IconButton>
        </Tooltip>
      </div>

      {(!videoUrl.isSuccess && !videoUrl.isError) && (
        <div style={{
          display: 'flex',
          // flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <CircularProgress />
        </div>
      )}

      {(sourceUrl) && (
        [
          <h2
            key={1}
            style={{
              margin: 0,
            }}
          >
            {curEventNum}:
            {/* {dsc} */}
          </h2>,
          <video
            key={2}
            onEnded={ended}
            onPlaying={onPlaying}
            ref={vidRef}
            autoPlay
            muted
            style={{
              width: '100%',
              // paddingTop: '50px',
              maxHeight: 'calc(100vh - 132px)',
            }}
            controls
            src={sourceUrl}
          />,
        ]
      )}

    </div>
  );
};

export default PlayRange;
