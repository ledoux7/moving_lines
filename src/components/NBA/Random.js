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
import {
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

const RandomShots = React.memo(() => {
  const [player, setPlayer] = useState();
  const [team, setTeam] = useState();
  const [opp, setOpp] = useState();

  const [curPlay, setCurPlay] = useState(null);
  const [curPlayObj, setCurPlayObj] = useState(null);
  const [typeSample, setTypeSample] = React.useState('Player');
  const [only3PT, setOnly3PT] = React.useState(false);

  const { data: randomShots, refetch: refetchShots } = useGetRandomShotsPlayer(player, only3PT ? '3' : '');
  const { data: randomShotsTeam, refetch: refetchShotsTeam } = useGetRandomShotsTeam(team, only3PT ? '3' : '');
  const { data: randomShotsOpp, refetch: refetchShotsOpp } = useGetRandomShotsOpp(opp, only3PT ? '3' : '');

  const { data: playerNamesData } = useGetPlayerNames();
  const { data: teamNamesData } = useGetTeamNames();

  const dd = typeSample === 'Player'
    ? randomShots
    : typeSample === 'Team'
      ? randomShotsTeam
      : randomShotsOpp;

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

  const teamNames = useMemo(() => {
    if (teamNamesData && teamNamesData.Items) {
      return teamNamesData.Items.map(t => t.team);
    }

    return [];
  }, [teamNamesData]);

  useEffect(() => {
    if (typeSample === 'Player' && randomShots && randomShots.Items && randomShots.Items.length) {
      console.log('hwa', randomShots);
      setCurPlay(0);
      setCurPlayObj(randomShots.Items[0]);
    }
    else if (typeSample === 'Team' && randomShotsTeam && randomShotsTeam.Items && randomShotsTeam.Items.length) {
      setCurPlay(0);
      setCurPlayObj(randomShotsTeam.Items[0]);
    }
    else if (typeSample === 'Opp' && randomShotsOpp && randomShotsOpp.Items && randomShotsOpp.Items.length) {
      setCurPlay(0);
      setCurPlayObj(randomShotsOpp.Items[0]);
    }
  }, [randomShots, randomShotsOpp, randomShotsTeam, typeSample]);

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
  else if (typeSample === 'Team') {
    autoCompleteCmp = (
      <Autocomplete
        fullWidth
        id='tags-standard'
        options={teamNames}
        disabled={typeSample !== 'Team'}
        onChange={(event, newValue) => {
          console.log('nw', newValue);
          setTeam(newValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant='standard'
            label='Team'
            placeholder='Team name'
          />
        )}
      />
    );
  }
  else if (typeSample === 'Opp') {
    autoCompleteCmp = (
      <Autocomplete
        fullWidth
        id='tags-standard'
        options={teamNames}
        disabled={typeSample !== 'Opp'}
        onChange={(event, newValue) => {
          console.log('nw', newValue);
          setOpp(newValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant='standard'
            label='Opp'
            placeholder='Opp'
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
      <h1>Random 10 Shot Sample</h1>
      <FormControl component='fieldset'>
        <FormLabel component='legend'>Type</FormLabel>
        <RadioGroup row value={typeSample} onChange={handleChangeRadio}>
          <FormControlLabel value='Player' control={<Radio />} label='Player ' />
          <FormControlLabel value='Team' control={<Radio />} label='Team' />
          <FormControlLabel value='Opp' control={<Radio />} label='Opp' />
        </RadioGroup>
        <FormControlLabel
          label='3PT Only'
          control={
            <Checkbox
              checked={only3PT}
              onChange={handleChange3PT}
              name='checkedB'
              color='primary'
              label='test'
            />
          }
        />
      </FormControl>

      {autoCompleteCmp}

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
        // onEnded={ended}
        // onPlaying={onPlaying}
        // ref={vidRef}
        autoPlay
        muted
        style={{
          // width: '100%',
          // maxHeight: 'calc(100vh - 350px)',
          height: 560,
        }}
        controls
        src={videoUrl.isSuccess ? videoUrl.data.Item.UrlHigh : ''}
      />
    </div>
  );
});

export default RandomShots;
