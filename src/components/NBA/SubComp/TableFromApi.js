/* eslint-disable react/display-name */

import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useProxyNBA,
} from '../../../hooks/analytics';
import BettingTable from '../Betting/BettingTable';

const TableFromApi = ({
  endpoint, enabled, queryParams, columns, callback, transformFunc,
}) => {
  const [fixed, setFixed] = useState(null);

  const {
    data: gamelogs,
    // isSuccess,
    // isLoading,
  } = useProxyNBA(endpoint, queryParams, !!enabled);

  useEffect(() => {
    if (gamelogs && gamelogs?.transformed && gamelogs?.endpoint === 'gamelogs') {
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
    else if (gamelogs && gamelogs?.transformed && gamelogs?.endpoint === 'leaguedashptstats') {
      const res = transformFunc(gamelogs?.transformed);
      setFixed(res);
    }
    else {
      setFixed(gamelogs?.transformed);
    }
  }, [gamelogs, transformFunc]);

  return (
    <BettingTable
    // data={tableData.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId))}
      data={fixed}
      columns={columns}
    />
  );
};

export default TableFromApi;
