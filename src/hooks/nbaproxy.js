/* eslint-disable max-len */
/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { TEAMS } from '../data/nba';
import { useGetBoxScoreGame, useGetPBPForGame, useProxyNBA } from './analytics';

export const useTeamStats = (period = 0, half = 0, measureType = 'Advanced') => {
  const dash = {
    'MeasureType': measureType,
    'PerMode': 'PerGame',
    'PlusMinus': 'N',
    'PaceAdjust': 'N',
    'Rank': 'N',
    'LeagueID': '00',
    'Season': '2022-23',
    'SeasonType': 'Regular Season',
    'PORound': 0,
    'Outcome': null,
    'Location': null,
    'Month': 0,
    'SeasonSegment': null,
    'DateFrom': null,
    'DateTo': null,
    'OpponentTeamID': 0,
    'VsConference': null,
    'VsDivision': null,
    'TeamID': 0,
    'Conference': null,
    'Division': null,
    // 'GameSegment': "First Half",
    'GameSegment': half === 0 ? null : (half === 1) ? 'First Half' : 'Second Half',
    'Period': period,
    'ShotClockRange': null,
    'LastNGames': 0,
    'GameScope': null,
    'PlayerExperience': null,
    'PlayerPosition': null,
    'StarterBench': null,
    'TwoWay': 0,
  };

  const query = useProxyNBA('leaguedashteamstats', dash);

  return query;
};

export const useTranspose = (homeTeamId, awayTeamId, isSuccessDash, teamStats, period, half) => {
  const [tableData, setTableData] = useState([]);

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
              [TEAMS[rows1[0].TEAM_ID][0]]: Math.round(((rows1[0].OFF_RATING / 100) * (rows1[0].PACE / poss)) * 100) / 100,
              [TEAMS[rows1[1].TEAM_ID][0]]: Math.round(((rows1[1].OFF_RATING / 100) * (rows1[1].PACE / poss)) * 100) / 100,
              'DIFF': 0,

              [TEAMS[rows1[0].TEAM_ID][0] + '_RANK']: rows1[0][cur + '_RANK'],
              [TEAMS[rows1[1].TEAM_ID][0] + '_RANK']: rows1[1][cur + '_RANK'],
              'AVG': average(teamStats?.transformed, cur),
            };
          }
          else {
            stat = {
              'STAT': cur,
              [TEAMS[rows1[0].TEAM_ID][0]]: rows1[0][cur],
              [TEAMS[rows1[1].TEAM_ID][0]]: rows1[1][cur],
              'DIFF': Math.round((rows1[0][cur] - rows1[1][cur]) * 100) / 100,

              [TEAMS[rows1[0].TEAM_ID][0] + '_RANK']: rows1[0][cur + '_RANK'],
              [TEAMS[rows1[1].TEAM_ID][0] + '_RANK']: rows1[1][cur + '_RANK'],
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

  return {
    isSuccessDash,
    transposed: tableData,
  };
};

export const usePlayerStats = (period = 0, half = 0, measureType = 'Advanced') => {
  const dash = {
    'MeasureType': measureType,
    'PerMode': 'PerGame',
    'PlusMinus': 'N',
    'PaceAdjust': 'N',
    'Rank': 'N',
    'LeagueID': '00',
    'Season': '2022-23',
    'SeasonType': 'Regular Season',
    'PORound': 0,
    'Outcome': null,
    'Location': null,
    'Month': 0,
    'SeasonSegment': null,
    'DateFrom': null,
    'DateTo': null,
    'OpponentTeamID': 0,
    'VsConference': null,
    'VsDivision': null,
    'TeamID': 0,
    'Conference': null,
    'Division': null,
    // 'GameSegment': "First Half",
    'GameSegment': half === 0 ? null : (half === 1) ? 'First Half' : 'Second Half',
    'Period': period,
    'ShotClockRange': null,
    'LastNGames': 0,
    'GameScope': null,
    'PlayerExperience': null,
    'PlayerPosition': null,
    'StarterBench': null,
    'TwoWay': 0,
  };

  const query = useProxyNBA('leaguedashplayerstats', dash);

  return query;
};
