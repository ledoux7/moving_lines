/* eslint-disable prefer-destructuring */
/* eslint-disable react/jsx-no-bind */
/* eslint-disable max-len */
import { Button } from '@material-ui/core';
import React, {
  useState, useEffect, useCallback, useRef, useMemo,
} from 'react';
import { useHistory, useLocation } from 'react-router';
import CircularProgress from '@material-ui/core/CircularProgress';
import {
  BOXSCORE_COLS, playerGamelogsParams, reboundingParams, REBOUNDING_COLS, TEAMS,
} from '../../../data/nba';
import { useGetSchedule, useProxyNBA } from '../../../hooks/analytics';
import { useAuthState } from '../../../context/context';
import { useTeamStats } from '../../../hooks/nbaproxy';
import BettingAdv from '../BettingAdv';
import TeamPlayerDropdown from '../SubComp/TeamPlayerDropdown';
import TableFromApi from '../SubComp/TableFromApi';
import Rebounding from './Rebounding';
import Adv from './Adv';
import Opp from './Opp';
import Base from './Base';

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
  const history = useHistory();

  const [value, setValue] = useState([0, 0]);
  const [tableData, setTableData] = useState([]);
  const [showPlays, setShowPlays] = useState(false);
  const [showTables, setShowTables] = useState(false);
  const [homeTeam, setHomeTeam] = useState(null);
  const [awayTeam, setAwayTeam] = useState(null);
  const [homeTeamId, setHomeTeamId] = useState(null);
  const [awayTeamId, setAwayTeamId] = useState(null);
  const [gameDate, setGameDate] = useState(null);

  const [homePlayer, setHomePlayer] = useState(null);
  const [awayPlayer, setAwayPlayer] = useState(null);

  const homePlayerParams = useMemo(() => playerGamelogsParams(homePlayer), [homePlayer]);
  const awayPlayerParams = useMemo(() => playerGamelogsParams(awayPlayer), [awayPlayer]);
  const bothReboundingParams = useMemo(() => reboundingParams(), []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const reboundingFilter = useCallback(
    // eslint-disable-next-line arrow-body-style
    transformed => {
      // return transformed.filter(t => t.TEAM_ID === homeTeamId || t.TEAM_ID === awayTeamId);
      return transformed;
    },
    [],
  );

  const gotoList = rangeArr => {
    history.push(`/playlist?gameId=${gameId}`);
  };

  const {
    data: schedule,
    isLoading,
    isSuccess,
  } = useGetSchedule();

  useEffect(() => {
    if (schedule) {
      const match = schedule.find(m => m.GAME_ID === gameId);
      console.log({ match });

      const home = match.HOME_TEAM_ID;
      setHomeTeam(TEAMS[home][0]);
      setHomeTeamId(home);

      const away = match.VISITOR_TEAM_ID;
      setAwayTeam(TEAMS[away][0]);
      setAwayTeamId(away);

      setGameDate(match.GAME_DATE_NO);
    }
  }, [gameId, schedule]);

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
        {/* {gameDate} */}
      </h3>
      {!showPlays && auth && auth.auth && (
        <h1>{gameDate}</h1>
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

      {/* <TableFromApi
        endpoint={'leaguedashptstats'}
        enabled={1}
        columns={REBOUNDING_COLS}
        queryParams={bothReboundingParams}
        transformFunc={reboundingFilter}
      /> */}

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <Rebounding teamId={homeTeamId} />
        <Rebounding teamId={awayTeamId} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <Base teamId={homeTeamId} />
        <Base teamId={awayTeamId} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <Adv teamId={homeTeamId} />
        <Adv teamId={awayTeamId} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <Opp teamId={homeTeamId} />
        <Opp teamId={awayTeamId} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '75%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <TeamPlayerDropdown teamId={homeTeamId} team={homeTeam} callback={setHomePlayer} />
        <TeamPlayerDropdown teamId={awayTeamId} team={awayTeam} callback={setAwayPlayer} />
      </div>

      <TableFromApi endpoint={'playergamelogs'} enabled={homePlayer} columns={BOXSCORE_COLS} queryParams={homePlayerParams} />
      <TableFromApi endpoint={'playergamelogs'} enabled={awayPlayer} columns={BOXSCORE_COLS} queryParams={awayPlayerParams} />

      { isSuccess && (
      <Button
        variant='contained'
        style={{
          textTransform: 'none',
          width: 250,
          fontSize: 26,
          margin: '10px 10px',
        }}
        color='primary'
        onClick={() => setShowTables(prev => !prev)}
      >
        Tables
      </Button>

      )}
      {isSuccess && showTables && (
        <div style={{
          display: 'flex', flexDirection: 'row', flexWrap: 'wrap',
          //  overflow: 'scroll', maxWidth: '100%',
        }}
        >
          <BettingAdv
            period={0}
            homeTeamId={homeTeamId}
            awayTeamId={awayTeamId}
          />
        </div>
      )}
      {isSuccess && showTables && (
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
      {isSuccess && showTables && (
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
