import {
  CircularProgress,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import React, {
  useState, useEffect, useMemo,
} from 'react';
import {
  useQuery,
} from 'react-query';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
  Cached,
  SkipNext,
  SkipPrevious,
} from '@material-ui/icons';
import { useDebounce } from 'use-lodash-debounce';
import {
  useGetIsItFoul,
  useGetPlayerNames,
  useGetTeamNames,
} from '../../hooks/analytics';
import {
  fetchViaProxy,
} from '../../api';

const IsIt = React.memo(() => {
  const [player, setPlayer] = useState('');
  const [gameId, setGameId] = useState('');
  const debouncedGameId = useDebounce(gameId, 1000);

  const [curPlay, setCurPlay] = useState(null);
  const [curPlayObj, setCurPlayObj] = useState(null);
  const [typeSample, setTypeSample] = React.useState('Player');
  const [only3PT, setOnly3PT] = React.useState(false);

  const { data: fouls, refetch: refetchShots } = useGetIsItFoul(player, debouncedGameId);

  const { data: playerNamesData } = useGetPlayerNames();
  const { data: teamNamesData } = useGetTeamNames();

  const dd = fouls;
  const keyObj = (dd && dd.Items[curPlay])
    ? {
      gameId: dd.Items[curPlay].game_id,
      eventNum: dd.Items[curPlay].eventnum,
      eventType: dd.Items[curPlay].event_type_id,
    }
    : {
      gameId: undefined, eventNum: undefined, eventType: undefined,
    };

  const handleChangeRadio = event => {
    setTypeSample(event.target.value);
  };

  const handleChange3PT = event => {
    setOnly3PT(event.target.checked);
  };

  const handleChangeGameID = event => {
    setGameId(event.target.value);
  };

  const videoUrl = useQuery(
    {
      queryKey: ['videoUrl', keyObj],
      queryFn: ({ queryKey }) => fetchViaProxy({ queryKey }),
      refetchOnWindowFocus: false,
      retry: 2,
      retryDelay: attempt => 500 + attempt * 2000,
      enabled: !!curPlayObj,
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
    if (typeSample === 'Player' && fouls && fouls.Items && fouls.Items.length) {
      console.log('hwa', fouls);
      setCurPlay(0);
      setCurPlayObj(fouls.Items[0]);
    }
  }, [fouls, typeSample]);

  let autoCompleteCmp = null;
  if (typeSample === 'Player') {
    autoCompleteCmp = (
      <Autocomplete
        fullWidth
        id='tags-standard'
        options={playerNames}
        disabled={typeSample !== 'Player'}
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
    );
  }

  return (
    <div style={{
      overflow: 'scroll',
      display: 'flex',
      width: '90%',
      flexDirection: 'column',
    }}
    >
      <h1>Is this a foul?</h1>

      {autoCompleteCmp}

      <TextField
        id='standard-multiline-flexible'
        label='Game ID'
        multiline
        maxRows={4}
        value={gameId}
        onChange={handleChangeGameID}
      />

      <div style={{
        display: 'flex',
        justifyContent: 'center',
        paddingTop: 10,
      }}
      >
        <Tooltip title={'Go Back'} placement='top'>
          <IconButton aria-label='delete' onClick={() => setCurPlay(c => c - 1)}>
            <SkipPrevious fontSize='large' />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Refetch New Sample'} placement='top'>
          <IconButton aria-label='delete' onClick={() => refetchShots()}>
            <Cached fontSize='large' />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Go Next'} placement='top'>
          <IconButton aria-label='delete' onClick={() => setCurPlay(c => c + 1)}>
            <SkipNext fontSize='large' />
          </IconButton>
        </Tooltip>
      </div>

      {
        videoUrl.isSuccess
          ? (
            <video
              key={2}
              autoPlay
              muted
              style={{
                height: 560,
              }}
              controls
              src={videoUrl.isSuccess ? videoUrl.data.Item.UrlHigh : ''}
            />
          )
          : videoUrl.isLoading
            ? (
              <div style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              >
                <CircularProgress />
              </div>
            )
            : null
      }
    </div>
  );
});

export default IsIt;
