/* eslint-disable react/display-name */

import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
  useGetPlayerNames,
  useGetTeamNames,
} from '../../../hooks/analytics';

const PlayerDropdown = ({ type, callback }) => {
  const { data: playerNamesData } = useGetPlayerNames();
  const { data: teamNamesData } = useGetTeamNames();

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

  let autoCompleteCmp = null;
  if (type === 'Player') {
    autoCompleteCmp = (
      <Autocomplete
        // fullWidth
        style={{
          width: 350,
        }}
        id='tags-standard'
        options={playerNames}
        disabled={type !== 'Player'}
        onChange={(event, newValue) => {
          console.log('nw', newValue);
          callback(newValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant='standard'
            label='Player Name'
            placeholder='Player name'
          />
        )}
      />
    );
  }
  else if (type === 'Team') {
    autoCompleteCmp = (
      <Autocomplete
        style={{
          width: 350,
        }}
        // fullWidth
        id='tags-standard'
        options={teamNames}
        disabled={type !== 'Team'}
        onChange={(event, newValue) => {
          console.log('nw', newValue);
          callback(newValue);
        }}
        renderInput={params => (
          <TextField
            {...params}
            variant='standard'
            label='Team Name'
            placeholder='Team name'
          />
        )}
      />
    );
  }

  return autoCompleteCmp;
};

export default PlayerDropdown;
