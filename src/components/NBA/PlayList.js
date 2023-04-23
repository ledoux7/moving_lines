/* eslint-disable no-unreachable-loop */
/* eslint-disable react/jsx-key */
import {
  CircularProgress, IconButton, Tooltip,
} from '@material-ui/core';
import { Cached, SkipNext, SkipPrevious } from '@material-ui/icons';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useQuery, useQueryClient,
} from 'react-query';
import { fetchViaProxy } from '../../api';

const PlayList = ({ cached, arr }) => {
  const [curPlay, setCurPlay] = useState(0);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [curEventNum, setCurEventNum] = useState();
  const [curEventType, setCurEventType] = useState();
  const [curGameId, setCurGameId] = useState();
  const [dsc, setDsc] = useState(null);
  const queryClient = useQueryClient();

  const videoUrl = useQuery(
    {
      queryKey: ['videoUrl', {
        gameId: curGameId, eventNum: curEventNum, eventType: curEventType, cached,
      }],
      queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay: attempt => 500 + attempt * 2000,
      enabled: curEventNum !== undefined,
      refetchOnMount: false,
    },
  );

  const vidRef = useRef(null);

  const tryNext = useCallback(
    (num = 1) => {
      for (let i = curPlay + num; i < arr.length; i++) {
        setCurEventNum(arr[i].eventNum);
        setCurEventType(arr[i].eventType);
        setCurGameId(arr[i].gameId);
        setCurPlay(i);
        break;
      }
    },
    [arr, curPlay],
  );

  const tryPrev = useCallback(
    (num = 1) => {
      for (let i = curPlay - num; i < arr.length && i >= 0; i--) {
        setCurEventNum(arr[i].eventNum);
        setCurEventType(arr[i].eventType);
        setCurGameId(arr[i].gameId);
        break;
      }
    },
    [arr, curPlay],
  );

  const ended = useCallback(
    () => {
      tryNext();
    },
    [tryNext],
  );

  const onPlaying = useCallback(
    async () => {
      for (let i = curPlay + 1; i < arr.length; i++) {
        console.log('pla', i, arr[i]);
        // eslint-disable-next-line no-await-in-loop
        await queryClient.prefetchQuery(
          {
            queryKey: ['videoUrl', {
              gameId: arr[i].gameId,
              eventNum: arr[i].eventNum,
              eventType: arr[i].eventType,
              cached,
            }],
            queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
            refetchOnWindowFocus: false,
            retry: 0,
            refetchOnMount: false,
          },
        );
        break;
      }
    },
    [arr, cached, curPlay, queryClient],
  );

  useEffect(() => {
    if (arr.length) {
      tryNext(0);
    }
  }, [arr, tryNext]);

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
      width: '100%',
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
        paddingBottom: 10,
        alignItems: 'center',
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
        {(videoUrl.isLoading && !videoUrl.data) && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          left: '10%',
        }}
        >
          <CircularProgress />
        </div>
        )}
      </div>

      {(sourceUrl) && (
        [
          <video
            key={2}
            onEnded={ended}
            onPlaying={onPlaying}
            ref={vidRef}
            autoPlay
            muted
            style={{
              width: '100%',
              maxHeight: 'min(calc(100vh - 220px), calc((100vw - 0px) * 0.5625))',
            }}
            controls
            src={sourceUrl}
          />,
        ]
      )}

    </div>
  );
};

export default PlayList;
