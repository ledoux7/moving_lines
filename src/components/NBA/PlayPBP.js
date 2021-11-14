/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useQuery, useQueries, useMutation } from 'react-query';
import { useLocation } from 'react-router';
// import pbpData from '../data';
import { fetchFromDynamoDb, fetchViaProxy } from '../../api';

const PlayPBP = pbpData => {
  const [curPlay, setCurPlay] = useState(null);
  const [curLoaded, setCurLoaded] = useState(false);
  const [sourceUrl, setSourceUrl] = useState(null);
  const [dsc, setDsc] = useState(null);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const eventNum = query.get('eventNum');
  const eventType = query.get('eventType');

  const vidRef = useRef(null);

  const {
    isLoading, error, data, refetch, isSuccess,
  } = useQuery(
    {
      queryKey: ['play', { gameId, eventNum, eventType }],
      queryFn: ({ queryKey }) => fetchFromDynamoDb({ queryKey }),

      refetchOnWindowFocus: false,
      retry: 0,
      staleTime: 60 * 1000,
      refetchOnMount: false,
    },
  );

  const {
    isLoading: isLoading2, error: error2, data: data2, refetch: refetch2, isSuccess: isSuccess2,
  } = useQuery(
    {
      queryKey: ['play', { gameId, eventNum, eventType }],
      queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: false,
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
      vidRef.current.playbackRate = 1.5;
    },
    [],
  );

  useEffect(() => {
    if (data && data.Item) {
      // setCurPlay(0);
      setSourceUrl(data.Item.UrlHigh.S);
      setDsc(data.Item.Dsc.S);
    }
    if (data2 && data2.Item) {
      console.log('awht', data2.Item);
      setSourceUrl(data2.Item.UrlHigh);
      setDsc(data2.Item.Dsc);
    }
  }, [data, data2]);

  useEffect(() => {
    if (vidRef.current) {
      vidRef.current.playbackRate = 1.5;
    }
  }, []);

  // console.log('loaded', data);
  // console.log('loaded2', sourceUrl, data2);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
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
        onClick={() => refetch2()}
      >
        Fetch
      </Button>

      {(sourceUrl) && (
        [
          <h1>{dsc}</h1>,
          <video
            onEnded={ended}
            onPlaying={onPlaying}
            ref={vidRef}
            autoPlay
            muted
            style={{
              width: '100%',
              height: '80vh',
            }}
            controls
            src={sourceUrl}
          />,
        ]
      )}

    </div>
  );
};

export default PlayPBP;
