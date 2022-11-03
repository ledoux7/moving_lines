/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useProxyNBA } from '../../hooks/analytics';
import { useAuthState } from '../../context/context';
import { useTeamStats } from '../../hooks/nbaproxy';
import BettingAdv from './BettingAdv';

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

const Betting = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const auth = useAuthState();

  const [value, setValue] = useState([0, 0]);
  const [cols, setCols] = useState([]);
  const [rows, setRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [showPlays, setShowPlays] = useState(false);
  const [showBoxScore, setShowBoxScore] = useState(false);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [homeTeamId, setHomeTeamId] = useState(null);
  const [awayTeamId, setAwayTeamId] = useState(null);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const history = useHistory();

  const gotoList = rangeArr => {
    history.push(`/playlist?gameId=${gameId}`);
  };

  const bs = {
    'GameID': gameId,
    'LeagueID': '00',
    'endPeriod': 3,
    'endRange': 28800,
    'rangeType': 1,
    'startPeriod': 3,
    'startRange': 0,
  };

  const {
    data,
    isSuccess,
    isLoading,
  } = useProxyNBA('boxscoretraditionalv3', bs);

  const {
    data: teamStats,
    isSuccess: isSuccessDash,
    isLoading: isLoadingDash,
  } = useTeamStats(0);

  useEffect(() => {
    if (isSuccess && data && data.server?.boxScoreTraditional) {
      console.log(data);
      const home = data.server?.boxScoreTraditional.homeTeamId;
      setHomeTeam(teams[home][0]);
      setHomeTeamId(home);

      const away = data.server?.boxScoreTraditional.awayTeamId;
      setAwayTeam(teams[away][0]);
      setAwayTeamId(away);
    }
  }, [data, isSuccess]);

  useEffect(() => {
    if (isSuccessDash && teamStats && teamStats?.transformed) {
      const columns = [
        'TEAM_ID',
        'TEAM_NAME',
        // 'GP',
        //  'W', 'L',
        // 'W_PCT', 'MIN', 'E_OFF_RATING',
        'OFF_RATING',
        // 'E_DEF_RATING',
        'DEF_RATING',
        // 'E_NET_RATING',
        'NET_RATING',
        // 'AST_PCT', 'AST_TO', 'AST_RATIO',
        'OREB_PCT', 'DREB_PCT', 'REB_PCT',
        //  'TM_TOV_PCT', 'EFG_PCT',
        'TS_PCT',
        // 'E_PACE',
        'PACE',
        // 'PACE_PER40', 'POSS', 'PIE'
      ];

      const h = teamStats.transformed.map(team => {
        // const newObj = Object.keys(team)
        const newObj = columns
          .reduce((acc, cur) => {
            acc[cur] = team[cur];
            return acc;
          }, {});

        return newObj;
      });

      const rows1 = h.filter(t => (t.TEAM_ID === homeTeamId) || (t.TEAM_ID === awayTeamId));

      if (rows1.length) {
        const arr = [
          {
            'STAT': 'NET_RATING',
            [rows1[0].TEAM_NAME]: rows1[0].NET_RATING,
            [rows1[1].TEAM_NAME]: rows1[1].NET_RATING,

          },
          {
            'STAT': 'TS_PCT',
            [rows1[0].TEAM_NAME]: rows1[0].TS_PCT,
            [rows1[1].TEAM_NAME]: rows1[1].TS_PCT,

          },
        ];
        // console.log('arrPre', arr);

        const auto = columns.reduce((acc, cur) => {
          const a = 12;
          // acc[]
          if (cur === 'TEAM_NAME' || cur === 'TEAM_ID') {
            return acc;
          }
          const stat = {
            'STAT': cur,
            [rows1[0].TEAM_NAME]: rows1[0][cur],
            [rows1[1].TEAM_NAME]: rows1[1][cur],
          };

          return acc.concat(stat);
        }, []);

        console.log('auto', auto);

        setTableData(auto);
      }
      else {
        // setTableData(teamStats.transformed);
      }
      console.log('trans', teamStats.transformed);
      // setTableData(teamStats.transformed);
    }
  }, [awayTeamId, homeTeamId, isSuccessDash, teamStats]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      flex: 1,
      alignItems: 'center',
      overflow: 'scroll',
    }}
    >
      <h1 style={{ fontSize: 45, margin: 0, padding: 0 }}>
        {/* {boxscore?.pages[0]?.Items?.length && boxscore?.pages[0]?.Items[0]?.matchup} */}
        {isSuccess && homeTeam + ' - ' + awayTeam}
      </h1>
      <h3 style={{ fontSize: 25, margin: 0, padding: 0 }}>
        {/* {dateStr} */}
      </h3>
      {!showPlays && auth && auth.auth && (
        <h1>Game Timeline</h1>
      )}
      {(isLoading) && (
        <div style={{
          display: 'flex',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <CircularProgress />
        </div>
      )}
      {isSuccess && data && (
        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
          <BettingAdv
            period={0}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
        </div>
      )}
      {isSuccess && data && (
        <div style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
        }}
        >
          <BettingAdv
            period={0}
            half={1}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
          <BettingAdv
            period={0}
            half={2}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
        </div>
      )}
      {isSuccess && data && (
        <div style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
        }}
        >
          <BettingAdv
            period={1}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
          <BettingAdv
            period={2}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
          <BettingAdv
            period={3}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
          <BettingAdv
            period={4}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
        </div>
      )}
      <div />
    </div>
  );
};

Betting.propTypes = {

};

export default Betting;
