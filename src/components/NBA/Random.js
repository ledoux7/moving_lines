import {
  Checkbox, CircularProgress, FormControl,
  FormControlLabel, FormLabel, IconButton, Radio, RadioGroup, Tooltip,
} from '@material-ui/core';
import React, {
  useState, useEffect, useMemo,
} from 'react';
import { useQuery } from 'react-query';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
  Cached,
  SkipNext,
  SkipPrevious,
} from '@material-ui/icons';
import {
  useGetPlayerNames,
  useGetRandomShotsOpp, useGetRandomShotsPlayer,
  useGetRandomShotsTeam, useGetTeamNames,
} from '../../hooks/analytics';
import { fetchViaProxy } from '../../api';

const RandomShots = React.memo(() => {
  const [player, setPlayer] = useState();
  const [team, setTeam] = useState();
  const [opp, setOpp] = useState();

  const [curPlay, setCurPlay] = useState(null);
  const [curPlayObj, setCurPlayObj] = useState(null);
  const [typeSample, setTypeSample] = React.useState('Player');
  const [only3PT, setOnly3PT] = React.useState(false);

  const { data: randomShots, refetch: refetchShots } = useGetRandomShotsPlayer(player, only3PT ? '3' : '');
  const { data: randomShotsTeam } = useGetRandomShotsTeam(team, only3PT ? '3' : '');
  const { data: randomShotsOpp } = useGetRandomShotsOpp(opp, only3PT ? '3' : '');

  const { data: playerNamesData } = useGetPlayerNames();
  const { data: teamNamesData } = useGetTeamNames();

  const dd = typeSample === 'Player'
    ? randomShots
    : typeSample === 'Team'
      ? randomShotsTeam
      : randomShotsOpp;

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

  // const add = Math.random() < 0.5 ? asd.as() : null;
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
          : (
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
      }

    </div>
  );
});

export default RandomShots;
