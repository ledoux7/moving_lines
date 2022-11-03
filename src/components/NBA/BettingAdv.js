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
import BettingTable from './BettingTable';
import { useTeamStats } from '../../hooks/nbaproxy';

const teams = {
  1610612737: ['ATL', 'Hawks', 1949, 'Atlanta', 'Atlanta Hawks', 'Atlanta', [1958]],
  1610612738: ['BOS', 'Celtics', 1946, 'Boston', 'Boston Celtics', 'Massachusetts', [1957, 1959, 1960, 1961, 1962, 1963, 1964, 1965, 1966, 1968, 1969, 1974, 1976, 1981, 1984, 1986, 2008]],
  1610612739: ['CLE', 'Cavaliers', 1970, 'Cleveland', 'Cleveland Cavaliers', 'Ohio', [2016]],
  1610612740: ['NOP', 'Pelicans', 2002, 'New Orleans', 'New Orleans Pelicans', 'Louisiana', []],
  1610612741: ['CHI', 'Bulls', 1966, 'Chicago', 'Chicago Bulls', 'Illinois', [1991, 1992, 1993, 1996, 1997, 1998]],
  1610612742: ['DAL', 'Mavericks', 1980, 'Dallas', 'Dallas Mavericks', 'Texas', [2011]],
  1610612743: ['DEN', 'Nuggets', 1976, 'Denver', 'Denver Nuggets', 'Colorado', []],
  1610612744: ['GSW', 'Warriors', 1946, 'Golden State', 'Golden State Warriors', 'California', [1947, 1956, 1975, 2015, 2017, 2018, 2022]],
  1610612745: ['HOU', 'Rockets', 1967, 'Houston', 'Houston Rockets', 'Texas', [1994, 1995]],
  1610612746: ['LAC', 'Clippers', 1970, 'Los Angeles', 'Los Angeles Clippers', 'California', []],
  1610612747: ['LAL', 'Lakers', 1948, 'Los Angeles', 'Los Angeles Lakers', 'California', [1949, 1950, 1952, 1953, 1954, 1972, 1980, 1982, 1985, 1987, 1988, 2000, 2001, 2002, 2009, 2010, 2020]],
  1610612748: ['MIA', 'Heat', 1988, 'Miami', 'Miami Heat', 'Florida', [2006, 2012, 2013]],
  1610612749: ['MIL', 'Bucks', 1968, 'Milwaukee', 'Milwaukee Bucks', 'Wisconsin', [1971, 2021]],
  1610612750: ['MIN', 'Timberwolves', 1989, 'Minnesota', 'Minnesota Timberwolves', 'Minnesota', []],
  1610612751: ['BKN', 'Nets', 1976, 'Brooklyn', 'Brooklyn Nets', 'New York', []],
  1610612752: ['NYK', 'Knicks', 1946, 'New York', 'New York Knicks', 'New York', [1970, 1973]],
  1610612753: ['ORL', 'Magic', 1989, 'Orlando', 'Orlando Magic', 'Florida', []],
  1610612754: ['IND', 'Pacers', 1976, 'Indiana', 'Indiana Pacers', 'Indiana', []],
  1610612755: ['PHI', '76ers', 1949, 'Philadelphia', 'Philadelphia 76ers', 'Pennsylvania', [1955, 1967, 1983]],
  1610612756: ['PHX', 'Suns', 1968, 'Phoenix', 'Phoenix Suns', 'Arizona', []],
  1610612757: ['POR', 'Trail Blazers', 1970, 'Portland', 'Portland Trail Blazers', 'Oregon', [1977]],
  1610612758: ['SAC', 'Kings', 1948, 'Sacramento', 'Sacramento Kings', 'California', [1951]],
  1610612759: ['SAS', 'Spurs', 1976, 'San Antonio', 'San Antonio Spurs', 'Texas', [1999, 2003, 2005, 2007, 2014]],
  1610612760: ['OKC', 'Thunder', 1967, 'Oklahoma City', 'Oklahoma City Thunder', 'Oklahoma', [1979]],
  1610612761: ['TOR', 'Raptors', 1995, 'Toronto', 'Toronto Raptors', 'Ontario', [2019]],
  1610612762: ['UTA', 'Jazz', 1974, 'Utah', 'Utah Jazz', 'Utah', []],
  1610612763: ['MEM', 'Grizzlies', 1995, 'Memphis', 'Memphis Grizzlies', 'Tennessee', []],
  1610612764: ['WAS', 'Wizards', 1961, 'Washington', 'Washington Wizards', 'District of Columbia', [1978]],
  1610612765: ['DET', 'Pistons', 1948, 'Detroit', 'Detroit Pistons', 'Michigan', [1989, 1990, 2004]],
  1610612766: ['CHA', 'Hornets', 1988, 'Charlotte', 'Charlotte Hornets', 'North Carolina', []],
};

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

  // console.log("tr", data);

  // https://stats.nba.com/stats/leaguedashteamstats?Conference=&DateFrom=&DateTo=&Division=&GameScope=&GameSegment=&Height=&LastNGames=0&LeagueID=00&Location=&MeasureType=Advanced&Month=0&OpponentTeamID=0&Outcome=&PORound=0&PaceAdjust=N&PerMode=PerGame&Period=3&PlayerExperience=&PlayerPosition=&PlusMinus=N&Rank=N&Season=2022-23&SeasonSegment=&SeasonType=Regular%20Season&ShotClockRange=&StarterBench=&TeamID=0&TwoWay=0&VsConference=&VsDivision=

  useEffect(() => {
    if (homeTeamId && awayTeamId) {
      setHomeTeam(teams[homeTeamId][0]);
      setAwayTeam(teams[homeTeamId][0]);
    }
  }, [awayTeamId, homeTeamId]);

  useEffect(() => {
    if (isSuccessDash && teamStats && teamStats?.transformed) {
      const columns = [
        'TEAM_ID',
        'TEAM_NAME',
        // 'GP',
        'W', 'L',
        // 'W_PCT', 'MIN', 'E_OFF_RATING',
        'OFF_RATING',
        // 'E_DEF_RATING',
        'DEF_RATING',
        // 'E_NET_RATING',
        'NET_RATING',
        // 'AST_PCT', 'AST_TO', 'AST_RATIO',
        'OREB_PCT', 'DREB_PCT', 'REB_PCT',
        'TM_TOV_PCT',
        'EFG_PCT',
        'TS_PCT',
        // 'E_PACE',
        'PACE',
        // 'PACE_PER40', 'POSS', 'PIE'
      ];

      // const h = teamStats.transformed.map(team => {
      //   // const newObj = Object.keys(team)
      //   const newObj = columns
      //     .reduce((acc, cur) => {
      //       acc[cur] = team[cur];
      //       return acc;
      //     }, {});

      //   return newObj;
      // });

      const rows1 = teamStats?.transformed.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId));

      if (rows1.length) {
        const average = (arrAll, stat) => Math.round((arrAll.reduce((acc, cur) => acc + cur[stat], 0) / arrAll.length) * 100) / 100;

        const auto = columns.concat(['EST_PTS']).reduce((acc, cur) => {
          const a = 12;
          // acc[]
          let stat;
          if (cur === 'TEAM_NAME' || cur === 'TEAM_ID') {
            return acc;
          }
          else if (cur === 'EST_PTS') {
            const poss = (period === 0 && half === 0) ? 1 : (period === 0 && half !== 0 ? 2 : 4);

            stat = {
              'STAT': cur,
              [teams[rows1[0].TEAM_ID][0]]: Math.round(((rows1[0].OFF_RATING / 100) * (rows1[0].PACE / poss)) * 100) / 100,
              [teams[rows1[1].TEAM_ID][0]]: Math.round(((rows1[1].OFF_RATING / 100) * (rows1[1].PACE / poss)) * 100) / 100,
              'DIFF': 0,

              [teams[rows1[0].TEAM_ID][0] + '_RANK']: rows1[0][cur + '_RANK'],
              [teams[rows1[1].TEAM_ID][0] + '_RANK']: rows1[1][cur + '_RANK'],
              'AVG': average(teamStats?.transformed, cur),
            };
          }
          else {
            stat = {
              'STAT': cur,
              [teams[rows1[0].TEAM_ID][0]]: rows1[0][cur],
              [teams[rows1[1].TEAM_ID][0]]: rows1[1][cur],
              'DIFF': Math.round((rows1[0][cur] - rows1[1][cur]) * 100) / 100,

              [teams[rows1[0].TEAM_ID][0] + '_RANK']: rows1[0][cur + '_RANK'],
              [teams[rows1[1].TEAM_ID][0] + '_RANK']: rows1[1][cur + '_RANK'],
              'AVG': average(teamStats?.transformed, cur),
            };
          }

          return acc.concat(stat);
        }, []);
        // console.log('auto', auto);
        setTableData(auto);
      }
      else {
        // setTableData(teamStats.transformed);
      }
      // console.log('trans', teamStats.transformed);
      // setTableData(teamStats.transformed);
    }
  }, [awayTeamId, half, homeTeamId, isSuccessDash, period, teamStats]);

  if (isSuccessDash && tableData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h1 style={{ textAlign: 'center' }}>
          Half {half} - Period {period}
        </h1>
        <BettingTable
          // data={tableData.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId))}
          data={tableData}
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
