/* eslint-disable react/display-name */
/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable max-len */
/* eslint-disable react/button-has-type */
import {
  Button, Checkbox, FormControl, FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Tooltip,
} from '@material-ui/core';
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
import { useDebouncedCallback, useDebounce } from 'use-lodash-debounce';
import {
  useGetIsItFoul,
  useGetPBPForGame, useGetPlayerNames, useGetRandomShotsOpp, useGetRandomShotsPlayer, useGetRandomShotsTeam, useGetTeamNames, useGetVideoUrlFresh,
} from '../../hooks/analytics';
import {
  fetchFromDynamoDb, fetchNew, fetchViaProxy, fetchPBP,
} from '../../api';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
];

const options = ['Option 1', 'Option 2'];

const IsIt = React.memo(() => {
  const [player, setPlayer] = useState('James Harden');
  const [gameId, setGameId] = useState('');
  const debouncedGameId = useDebounce(gameId, 1000);
  const debouncedSetGameId = useDebouncedCallback(setGameId, 1000);
  const debounced = useDebouncedCallback(
    // function
    value => {
      setGameId(value);
    },
    // delay in ms
    1000,
  );

  const [team, setTeam] = useState();
  const [opp, setOpp] = useState();

  const [curPlay, setCurPlay] = useState(null);
  const [curPlayObj, setCurPlayObj] = useState(null);
  const [typeSample, setTypeSample] = React.useState('Player');
  const [only3PT, setOnly3PT] = React.useState(false);

  const { data: fouls, refetch: refetchShots } = useGetIsItFoul(player, debouncedGameId);
  // const { data: randomShotsTeam, refetch: refetchShotsTeam } = useGetRandomShotsTeam(team, only3PT ? '3' : '');
  // const { data: randomShotsOpp, refetch: refetchShotsOpp } = useGetRandomShotsOpp(opp, only3PT ? '3' : '');

  const { data: playerNamesData } = useGetPlayerNames();
  const { data: teamNamesData } = useGetTeamNames();

  // const dd = typeSample === 'Player'
  //   ? randomShots
  //   : typeSample === 'Team'
  //     ? randomShotsTeam
  //     : randomShotsOpp;
  const dd = fouls;
  const keyObj = (dd && dd.Items[curPlay])
    ? {
      gameId: dd.Items[curPlay].game_id, eventNum: dd.Items[curPlay].eventnum, eventType: dd.Items[curPlay].event_type_id,
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

  const teamNames = useMemo(() => {
    if (teamNamesData && teamNamesData.Items) {
      return teamNamesData.Items.map(t => t.team);
    }

    return [];
  }, [teamNamesData]);

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
    </div>
  );
});

export default IsIt;
