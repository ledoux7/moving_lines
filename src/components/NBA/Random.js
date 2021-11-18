/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import { Button, IconButton } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useQuery, useQueries, useMutation, useInfiniteQuery,
} from 'react-query';
import { useHistory, useLocation } from 'react-router';
import Slider from '@material-ui/core/Slider';
import { Link } from 'react-router-dom';
import Chip from '@material-ui/core/Chip';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {
  Cached,
  Pause, PlayArrow, SkipNext, SkipPrevious,
} from '@material-ui/icons';
import {
  useGetPBPForGame, useGetPlayerNames, useGetRandomShotsPlayer, useGetVideoUrlFresh,
} from '../../hooks/analytics';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP,
} from '../../api';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
];

const options = ['Option 1', 'Option 2'];

const RandomShots = React.memo(({
}) => {
  const [player, setPlayer] = useState();
  const [curPlay, setCurPlay] = useState(null);
  const [curPlayObj, setCurPlayObj] = useState(null);

  const { data: randomShots, refetch: refetchShots } = useGetRandomShotsPlayer(player);

  const { data: playerNamesData } = useGetPlayerNames();

  const keyObj = (randomShots && randomShots.Items[curPlay])
    ? {
      gameId: randomShots.Items[curPlay].game_id, eventNum: randomShots.Items[curPlay].eventnum, eventType: randomShots.Items[curPlay].event_type_id,
    }
    : {
      gameId: undefined, eventNum: undefined, eventType: undefined,
    };

  // const { refetch } = useGetVideoUrlFresh(gameId, curEventNum, curEventType, false);

  const videoUrl = useQuery(
    {
      queryKey: ['videoUrl', keyObj],
      queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: attempt => 500 + attempt * 2000,
      enabled: !!curPlayObj,
      // staleTime: 60 * 1000,
      refetchOnMount: false,
      cacheTime: Infinity,
      staleTime: Infinity,
    },
  );

  const playerNames = useMemo(() => {
    if (playerNamesData && playerNamesData.Items) {
      return playerNamesData.Items.map(p => p.player);
    }

    return [];
  }, [playerNamesData]);

  useEffect(() => {
    if (randomShots && randomShots.Items && randomShots.Items.length) {
      console.log('hwa', randomShots);
      setCurPlay(0);
      setCurPlayObj(randomShots.Items[0]);
    }
  }, [randomShots]);

  return (
    <div style={{
      overflow: 'scroll',
      display: 'flex',
      // flex: 1,
      width: '90%',
      flexDirection: 'column',
    }}
    >
      <h1>Random 10 Shot Sample</h1>
      <Autocomplete
        // multiple
        fullWidth
        disableCloseOnSelect
        id='tags-standard'
        options={playerNames}
        onChange={(event, newValue) => {
          console.log('nw', newValue);
          setPlayer(newValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant='standard'
            label='Player'
            placeholder='Player name'
          />
        )}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 20,
      }}
      >
        <IconButton aria-label='delete' onClick={() => setCurPlay(c => c - 1)}>
          <SkipPrevious fontSize='large' />
        </IconButton>
        <IconButton aria-label='delete' onClick={() => refetchShots()}>
          <Cached fontSize='large' />
        </IconButton>
        <IconButton aria-label='delete' onClick={() => setCurPlay(c => c + 1)}>
          <SkipNext fontSize='large' />
        </IconButton>
      </div>
      <video
        key={2}
        // onEnded={ended}
        // onPlaying={onPlaying}
        // ref={vidRef}
        // autoPlay
        muted
        style={{
          width: '100%',
          maxHeight: 'calc(100vh - 300px)',
        }}
        controls
        src={videoUrl.isSuccess ? videoUrl.data.Item.UrlHigh : ''}
      />
    </div>
  );
});

export default RandomShots;
