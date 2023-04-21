/* eslint-disable react/jsx-key */
/* eslint-disable react/display-name */

import { TextField } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import {
  useProxyNBA,
} from '../../../hooks/analytics';
import BettingTable from '../Betting/BettingTable';

const TableFromApi = ({
  endpoint, enabled, queryParams, queryParams2, columns, callback, transformFunc,
}) => {
  const [fixed, setFixed] = useState(null);
  const [both, setBoth] = useState([]);
  const [targetValue, setTargetValue] = useState(0);
  const [targetCat, setTargetCat] = useState('REB');

  const [outOf, setOutOf] = useState('');

  const {
    data: gamelogs,
    // isSuccess,
    // isLoading,
  } = useProxyNBA(endpoint, queryParams, !!enabled);

  const {
    data: gamelogs2,
  } = useProxyNBA(endpoint, queryParams2, !!enabled);

  useEffect(() => {
    if (gamelogs && gamelogs2) {
      // eslint-disable-next-line no-unsafe-optional-chaining
      setBoth([...gamelogs2?.transformed, ...gamelogs?.transformed]);
    }
  }, [gamelogs, gamelogs2]);

  useEffect(() => {
    if (both.length && gamelogs?.endpoint === 'gamelogs') {
      const hmm = both.map(g => {
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
    }
    else if (both.length && gamelogs?.endpoint === 'leaguedashptstats') {
      const res = transformFunc(both);
      setFixed(res);
    }
    else {
      setFixed(both?.transformed);
    }
  }, [gamelogs, transformFunc, both]);

  useEffect(() => {
    if (targetValue > 0 && fixed) {
      const above = fixed?.filter(game => game[targetCat] > targetValue).length || 0;
      const total = fixed?.length || 1;
      setOutOf(above + ' / ' + total + ' (' + ((Math.round((above / total) * 100) / 100) * 100) + '%)');
    }
  }, [fixed, targetCat, targetValue]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      { fixed && ([<TextField
        id='standard-number'
        label='Category'
        value={targetCat}
        // type='number'
        InputLabelProps={{
          shrink: true,
        }}
        onChange={e => {
          setTargetCat(e.target.value);
        }}
      />,
        <TextField
          id='standard-number'
          label='Number'
          type='number'
          InputLabelProps={{
            shrink: true,
          }}
          onChange={e => {
            setTargetValue(e.target.value);
          }}
        />,
        <div style={{ fontSize: 20 }}>
          Out of: {outOf}
        </div>]
      )}
      <BettingTable
        // data={tableData.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId))}
        data={fixed}
        columns={columns}
      />
    </div>
  );
};

export default TableFromApi;
