/* eslint-disable react/display-name */
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
  useProxyNBA,
} from '../../../hooks/analytics';

const TeamPlayerDropdown = ({ teamId, type, callback }) => {
  const homeParams = {
    'LeagueID': '00',
    'TeamID': teamId,
    'Season': '2022-23',
    'cache': 1,
    'from': new Date(Date.now() - (2 * 86400 * 1000)).toISOString().split('T')[0],
  };

  const {
    data: roster,
    // isSuccess,
    // isLoading,
  } = useProxyNBA('commonteamroster', homeParams, !!teamId);

  const playerNames = useMemo(() => {
    if (roster && roster?.transformed) {
      return roster.transformed.map(p => ({ name: p.PLAYER, id: p.PLAYER_ID }));
    }

    return [];
  }, [roster]);

  const autoCompleteCmp = null;

  if (!playerNames?.length) {
    return null;
  }

  return (
    <Autocomplete
      // fullWidth
      style={{
        width: 350,
      }}
      id='tags-standard'
      options={playerNames}
      getOptionLabel={option => option.name}
      // disabled={type !== 'Player'}
      onChange={(event, newValue) => {
        console.log('nw', newValue);
        callback(newValue.id);
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
};

export default TeamPlayerDropdown;
