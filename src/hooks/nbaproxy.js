/* eslint-disable import/prefer-default-export */
import { useEffect, useState } from 'react';
import { useGetBoxScoreGame, useGetPBPForGame, useProxyNBA } from './analytics';

export const useTeamStats = (period = 0, half = 0) => {
  const dash = {
    'MeasureType': 'Advanced',
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
