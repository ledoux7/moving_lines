import { Button, TextField } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, {
  useCallback, useEffect, useMemo,
  useState,
} from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useGetTeamNames } from '../../../hooks/analytics';
import MatchupStats from './MatchupStats';

const Matchup = () => {
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const history = useHistory();

  const handleSubmit = useCallback((home, away) => {
    history.push(`/matchup?home=${home || ''}&away=${away || ''}`);
  }, [history]);

  const { data: teamNamesData } = useGetTeamNames();

  useEffect(() => {
    if (homeTeam || awayTeam) {
      handleSubmit(homeTeam, awayTeam);
    }
  }, [awayTeam, handleSubmit, homeTeam]);

  const teamNames = useMemo(() => {
    if (teamNamesData && teamNamesData.Items) {
      return teamNamesData.Items.map(t => t.team);
    }

    return [];
  }, [teamNamesData]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
    }}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
      }}
      >
        <Autocomplete
          id='tags-standard'
          options={teamNames}
          style={{
            width: 350,
            padding: 20,
          }}
          onChange={(event, newValue) => {
            console.log('nw', newValue);
            setHomeTeam(newValue);
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant='standard'
              label='Home Team'
              placeholder='Team name'
            />
          )}
        />
        <Autocomplete
          id='tags-standard'
          options={teamNames}
          style={{
            width: 350,
            padding: 20,
          }}
          onChange={(event, newValue) => {
            console.log('nw', newValue);
            setAwayTeam(newValue);
          }}
          renderInput={params => (
            <TextField
              {...params}
              variant='standard'
              label='Away Team'
              placeholder='Team name'
            />
          )}
        />
      </div>

      {(homeTeam && awayTeam) && (
        <MatchupStats />
      )}
    </div>
  );
};

export default Matchup;
