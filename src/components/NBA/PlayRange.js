/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button, CircularProgress } from '@material-ui/core';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useQuery, useQueries, useMutation, useQueryClient,
} from 'react-query';
import { useLocation } from 'react-router';
// import pbpData from '../data';
import { fetchFromDynamoDb, fetchViaProxy } from '../../api';
import { useGetPBPForGame, useGetVideoUrlFresh } from '../../hooks/analytics';

const PlayRange = ({ cached }) => {
  const [curPlay, setCurPlay] = useState(null);
  const [curLoaded, setCurLoaded] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [err, setError] = useState(false);
  const [curEventNum, setCurEventNum] = useState();
  const [curEventType, setCurEventType] = useState();
  const [dsc, setDsc] = useState(null);
  // const [pbpRange, setPBPRange] = useState([]);
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

  const { refetch } = useGetVideoUrlFresh(gameId, curEventNum, curEventType, false);

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
      // queryFn: ({ queryKey }) => fetchFromDynamoDb({ queryKey }),
      // queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      queryFn: cached
        ? ({ queryKey }) => fetchFromDynamoDb({ queryKey })
        : ({ queryKey }) => fetchViaProxy({ queryKey }),

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
    () => {
      for (let i = curPlay + 1; i < pbpRange.length; i++) {
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
              queryFn: cached
                ? ({ queryKey }) => fetchFromDynamoDb({ queryKey })
                : ({ queryKey }) => fetchViaProxy({ queryKey }),
              refetchOnWindowFocus: false,
              retry: 0,
              // staleTime: 60 * 1000,
              refetchOnMount: false,
            },
          );
          break;
        }
        // console.log('skipped prefetch', pbpRange[i]);
      }
    },
    [cached, curPlay, gameId, pbpRange, queryClient],
  );

  // useEffect(() => {
  //   if (vidRef.current) {
  //     vidRef.current.playbackRate = 1.5;
  //   }
  // }, []);

  useEffect(() => {
    if (pbpRange.length) {
      for (let i = 0; i < pbpRange.length; i++) {
        if (pbpRange[i] && pbpRange[i].video !== '0') {
          setCurEventNum(pbpRange[i].eventnum);
          setCurEventType(pbpRange[i].event_type_id);
          setCurPlay(i);
          // console.log('fist', pbpRange[i]);
          break;
        }
        // console.log('first skipped', pbpRange[i]);
      }
    }
  }, [pbpRange]);

  useEffect(() => {
    // console.log('hello', videoUrl);
    // if (videoUrl && videoUrl.data && Object.keys(videoUrl.data).length === 0) {
    //   setError(true);
    //   return;
    // }

    if (cached) {
      if (videoUrl.data && videoUrl.data.Item) {
        // setCurPlay(0);
        setSourceUrl(videoUrl.data.Item.UrlHigh.S);
        setDsc(videoUrl.data.Item.Dsc.S);
      }
    }
    else if (videoUrl.data && videoUrl.data.Item) {
      // setCurPlay(0);
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
          <Button
            variant='contained'
            style={{
              textTransform: 'none',
              width: 200,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            onClick={() => tryNext()}
          >
            Try Next
          </Button>
          <Button
            variant='contained'
            style={{
              textTransform: 'none',
              width: 200,
              fontSize: 26,
              margin: '10px 10px',
            }}
            color='primary'
            onClick={() => {
              refetch();
              setTimeout(() => videoUrl.refetch(), 5000);
            }}
          >
            Fetch This
          </Button>
          <h1>No video cached, try with proxy</h1>
        </div>
      )}

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
