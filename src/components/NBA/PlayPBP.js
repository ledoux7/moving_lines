/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button, CircularProgress } from '@material-ui/core';
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
    isLoading, isError, error, data, refetch, isSuccess,
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
    isLoading: isLoading2, error: error2, data: data32, refetch: refetch2, isSuccess: isSuccess2,
  } = useQuery(
    {
      queryKey: ['playProxy', { gameId, eventNum, eventType }],
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
      // vidRef.current.playbackRate = 1.5;
    },
    [],
  );

  useEffect(() => {
    console.log('hot', data, data32);
    if (data && data.Item) {
      // setCurPlay(0);
      setSourceUrl(data.Item.UrlHigh.S);
      setDsc(data.Item.Dsc.S);
    }
    else if (data32 && data32.Item) {
      console.log('awht', data32.Item);
      setSourceUrl(data32.Item.UrlHigh);
      setDsc(data32.Item.Dsc);
    }
  }, [data, data32]);

  // useEffect(() => {
  //   if (vidRef.current) {
  //     vidRef.current.playbackRate = 1.5;
  //   }
  // }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
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
      {isError && !isSuccess2 && <h1>No video cached, try to fetch</h1>}
      {(isLoading || isLoading2) && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <CircularProgress />
        </div>
      )}

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
