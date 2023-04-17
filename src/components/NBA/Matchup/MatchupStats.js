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
  BOXSCORE_COLS, playerGamelogsParams, reboundingParams, REBOUNDING_COLS, TEAMS, TEAMS_ABBR,
} from '../../../data/nba';
import { useGetSchedule, useProxyNBA } from '../../../hooks/analytics';
import { useAuthState } from '../../../context/context';
import { useTeamStats } from '../../../hooks/nbaproxy';
import BettingAdv from '../BettingAdv';
import TeamPlayerDropdown from '../SubComp/TeamPlayerDropdown';
import TableFromApi from '../SubComp/TableFromApi';
import Rebounding from '../Betting/Rebounding';
import Adv from '../Betting/Adv';
import Opp from '../Betting/Opp';
import Base from '../Betting/Base';
import TeamCard from '../Betting/TeamCard';
import PlayerCard from '../Betting/PlayerCard';

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

const shootingCols = ['EFG_PCT', 'TS_PCT', 'AST_PCT'];
const fgCols = ['FGA', 'FG_MISS', 'FG3A', 'FG3_PCT', 'FG2A', 'FG2_PCT'];
const oppCols = ['OPP_REB', 'OPP_FGA', 'OPP_FG2A', 'OPP_FG2_PCT', 'OPP_FG3A', 'OPP_FG3_PCT', 'OPP_FG_MISS'];
const advCols = ['OFF_RATING', 'DEF_RATING', 'NET_RATING', 'REB_PCT', 'OREB_PCT', 'DREB_PCT', 'PACE'];

const MatchupStats = () => {
  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const gameId = query.get('gameId');
  const home = query.get('home');
  const away = query.get('away');
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
  const [isSuccess, setIsSuccess] = useState(false);

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

  useEffect(() => {
    setHomeTeam(home);
    setHomeTeamId(TEAMS_ABBR[home]);

    setAwayTeam(away);
    setAwayTeamId(TEAMS_ABBR[away]);
    setIsSuccess(true);
  }, [home, away]);

  if (!isSuccess) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'center',
        overflow: 'scroll',
      }}
      // key={home + away}
    >
      <h1 style={{ fontSize: 45, margin: 0, padding: 0 }}>
        {/* {boxscore?.pages[0]?.Items?.length && boxscore?.pages[0]?.Items[0]?.matchup} */}
        {homeTeam + ' - ' + awayTeam}
      </h1>
      <h3 style={{ fontSize: 25, margin: 0, padding: 0 }}>
        {/* {dateStr} */}
        {/* {gameDate} */}
      </h3>
      {!showPlays && auth && auth.auth && (
        <h1>{gameDate}</h1>
      )}

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <TeamCard
          teamId={homeTeamId}
          measureType={'Base'}
          // cols={['FGA', 'FG3A']}
          cols={fgCols}

        />
        <TeamCard
          teamId={awayTeamId}
          measureType={'Base'}
          cols={fgCols}
          // cols={['FGA', 'FG3A']}
        />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <TeamCard
          teamId={homeTeamId}
          measureType={'Advanced'}
          cols={advCols}
        />
        <TeamCard
          teamId={awayTeamId}
          measureType={'Advanced'}
          cols={advCols}
        />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <TeamCard
          teamId={homeTeamId}
          measureType={'Advanced'}
          cols={shootingCols}
          key={12345}
        />
        <TeamCard
          teamId={awayTeamId}
          measureType={'Advanced'}
          cols={shootingCols}
          key={123}
        />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <TeamCard
          teamId={homeTeamId}
          measureType={'Opponent'}
          cols={oppCols}
        />
        <TeamCard
          teamId={awayTeamId}
          measureType={'Opponent'}
          cols={oppCols}
        />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '75%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        <TeamPlayerDropdown teamId={homeTeamId} team={homeTeam} callback={setHomePlayer} />
        <TeamPlayerDropdown teamId={awayTeamId} team={awayTeam} callback={setAwayPlayer} />
      </div>

      <div style={{
        display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', alignContent: 'center',
      }}
      >
        {homePlayer && (
          <PlayerCard
            playerId={homePlayer}
            measureType={'Base'}
            cols={['REB', 'PTS', 'AST']}
            key={homePlayer}
          />
        )}
        {awayPlayer && (
        <PlayerCard
          playerId={awayPlayer}
          measureType={'Base'}
          cols={['REB', 'PTS', 'AST']}
          key={awayPlayer}
        />
        )}
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

MatchupStats.propTypes = {

};

export default MatchupStats;
