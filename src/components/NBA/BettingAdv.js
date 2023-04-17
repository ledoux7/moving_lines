/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import Slider from '@material-ui/core/Slider';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useGetBoxScoreGame, useGetPBPForGame, useProxyNBA } from '../../hooks/analytics';
import PlaySelector from './PlaySelecter';
import BoxScoreTable from '../Table';
import { useAuthState } from '../../context/context';
import BettingTable from './Betting/BettingTable';
import { useTeamStats, useTranspose } from '../../hooks/nbaproxy';
import { TEAMS } from '../../data/nba';

const betCols1 = [
  {
    Header: 'player',
    accessor: 'TEAM_NAME', // accessor is the "key" in the data
  },
  {
    Header: 'Net',
    accessor: 'NET_RATING',
  },
];

const betCols = [
  // 'TEAM_ID',
  'TEAM_NAME',
  // 'GP',
  'W', 'L',
  // 'W_PCT', 'MIN', 'E_OFF_RATING',
  'OFF_RATING',
  // 'E_DEF_RATING',
  'DEF_RATING',
  // 'E_NET_RATING',
  'NET_RATING',
  'AST_PCT', 'AST_TO', 'AST_RATIO',
  'OREB_PCT', 'DREB_PCT', 'REB_PCT', 'TM_TOV_PCT', 'EFG_PCT', 'TS_PCT', 'E_PACE', 'PACE', 'PACE_PER40', 'POSS',
  // , 'PIE'
].map(c => ({ Header: c, accessor: c }));

/*
['TEAM_ID', 'TEAM_NAME', 'GP', 'W', 'L', 'W_PCT', 'MIN', 'E_OFF_RATING', 'OFF_RATING', 'E_DEF_RATING', 'DEF_RATING', 'E_NET_RATING', 'NET_RATING', 'AST_PCT', 'AST_TO', 'AST_RATIO', 'OREB_PCT', 'DREB_PCT', 'REB_PCT', 'TM_TOV_PCT', 'EFG_PCT',
 'TS_PCT', 'E_PACE', 'PACE', 'PACE_PER40', 'POSS', 'PIE', 'GP_RANK',
//  'W_RANK', 'L_RANK', 'W_PCT_RANK', 'MIN_RANK'
 'OFF_RATING_RANK', 'DEF_RATING_RANK', 'NET_RATING_RANK',
  'AST_PCT_RANK', 'AST_TO_RANK', 'AST_RATIO_RANK',
   'OREB_PCT_RANK', 'DREB_PCT_RANK', 'REB_PCT_RANK',
    'TM_TOV_PCT_RANK', 'EFG_PCT_RANK', 'TS_PCT_RANK', 'PACE_RANK', 'PIE_RANK',
     'CFID', 'CFPARAMS'
    ]
*/
const BettingAdv = ({
  homeTeamId, awayTeamId, period = 0, half = 0,
}) => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const auth = useAuthState();

  const [tableData, setTableData] = useState([]);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);

  const {
    data: teamStats,
    isSuccess: isSuccessDash,
    isLoading: isLoadingDash,
  } = useTeamStats(period, half);

  // https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Advanced&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=3&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2022-23&SeasonSegment=&SeasonType=Regular%20Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=

  useEffect(() => {
    if (homeTeamId && awayTeamId) {
      setHomeTeam(TEAMS[homeTeamId][0]);
      setAwayTeam(TEAMS[homeTeamId][0]);
    }
  }, [awayTeamId, homeTeamId]);

  const {
    transposed,
  } = useTranspose(homeTeamId, awayTeamId, isSuccessDash, teamStats, period, half);

  if (isSuccessDash && tableData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ textAlign: 'center' }}>
          Half {half} - Period {period}
        </h1>
        <BettingTable
          // data={tableData.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId))}
          data={transposed}
          // columns={betCols}
        />
      </div>
    );
  }
  return null;
};

BettingAdv.propTypes = {

};

export default BettingAdv;
