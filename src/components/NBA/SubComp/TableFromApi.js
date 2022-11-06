/* eslint-disable react/display-name */

import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import {
  useGetPlayerNames,
  useGetTeamNames,
  useProxyNBA,
} from '../../../hooks/analytics';
import BettingTable from '../BettingTable';

const PlayerGameLogs = ({
  playerId, teamId, columns, callback,
}) => {
  const [fixed, setFixed] = useState(null);

  const homeParams = {
    'MeasureType': 'Base',
    'PerMode': 'Totals',
    'LeagueID': '00',
    'Season': '2022-23',
    'SeasonType': 'Regular Season',
    'PORound': 0,
    // 'TeamID': teamId,
    'TeamID': null,
    'PlayerID': playerId,
    // 'PlayerID': null,
    'Outcome': null,
    'Location': null,
    'Month': 0,
    'SeasonSegment': null,
    'DateFrom': null,
    // 'DateFrom': '11/01/2022',
    'DateTo': null,
    'OppTeamID': 0,
    'VsConference': null,
    'VsDivision': null,
    'GameSegment': null,
    'Period': 0,
    'ShotClockRange': null,
    'LastNGames': 0,
    'cache': 0,
    // 'from': new Date(Date.now() - (2 * 86400 * 1000)).toISOString().split('T')[0],
    'from': new Date(Date.now()).toISOString().split('T')[0],

  };

  const {
    data: gamelogs,
    // isSuccess,
    // isLoading,
  } = useProxyNBA('playergamelogs', homeParams, !!playerId);

  useEffect(() => {
    if (gamelogs && gamelogs?.transformed) {
      const hmm = gamelogs.transformed.map(g => {
        // eslint-disable-next-line prefer-destructuring, no-param-reassign
        const cpy = {
          ...g,
        };
        // eslint-disable-next-line prefer-destructuring
        cpy.GAME_DATE = cpy.GAME_DATE.split('T')[0];
        cpy.MIN = Math.round(cpy.MIN * 10) / 10;

        return cpy;
      });
      setFixed(hmm);
      // console.log({ gamelogs });
    }
  }, [gamelogs]);

  const autoCompleteCmp = null;

  return (
    <BettingTable
    // data={tableData.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId))}
      data={fixed}
      columns={columns}
    />
  );
};

export default PlayerGameLogs;
